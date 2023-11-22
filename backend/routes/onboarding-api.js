require('dotenv').config()
const express = require('express')
const onboardingRouter = express.Router()
const User = require('../models/userSchema')
const { addEmailtoQdrant, createQdrantCollection, deleteQdrantCollection } = require('../utils/embedding-functions')
const { getGmailApiClient, getOnboardingMail, newToOldMailSort } = require('../utils/gmail-functions')
const getOAuthClient = require('../utils/get-oauth')
const authCheck = require('../auth/auth-check')
const { onboardingQueue } = require('../utils/queue')
const { qdrantLock } = require('../utils/mutex')
const onboardingCheck = require('../auth/onboarding-check')


onboardingRouter.use(authCheck)

onboardingRouter.delete('/no-consent-delete-account', async (req, res) => {
    try {
        const userId = req.user.id
        const { emailAddress } = req.user
        await User.findByIdAndDelete(userId)
        res.status(200).send(`User ${emailAddress} deleted successfully`)
    } catch (e) {
        console.error('[DELETE /onboarding/no-consent-delete-account] Error deleting account:', e)
        res.status(500).send('Something went wrong while deleting account')
    }
})

onboardingRouter.post('/third-party-consent', async (req, res) => {
    try {
        const userId = req.user.id


        await User.findByIdAndUpdate(userId, { thirdPartyConsent: true })
        res.status(200).send('Third party consent was successfully updated')
    } catch (e) {
        console.error('[POST /onboarding/third-party-consent] Error updating third party consent:', e)
        res.status(500).send('Something went wrong while updating third party consent')
    }
})

onboardingRouter.get('/third-party-consent', async (req, res) => {
    try {
        if (req.user.thirdPartyConsent) return res.status(200).send('Third party consent was already given')
        else return res.status(403).send('You must consent to third-party API usage to access Email AI Filter.')

    } catch (e) {
        console.error('[GET /onboarding/third-party-consent] Error getting third party consent:', e)
        res.status(500).send('Something went wrong while getting third party consent')
    }
})

onboardingRouter.post('/loading', async (req, res) => {
    // console.log(`started onboarding for ${req.user.emailAddress}`) (Development only)
    if (!req.user) {
        // If req.user is not defined or empty, handle the error
        return res.status(400).json({ error: 'User data not available.' })
    }
    try {//onboarding logic here
        const currentUser = req.user
        const { isOnboarded, emailAddress } = currentUser
        const userId = currentUser.id
        if (!isOnboarded && currentUser.inboxFilter) {
            //onboarding logic
            // get last 250 gmails
            const inboxFilter = currentUser.inboxFilter
            const oAuth2Client = await getOAuthClient(currentUser)
            let sortedEmails

            // pause redis queue
            await onboardingQueue.pause()
                .then(async () => {
                    // console.log(`Queue was paused for: ${emailAddress}`) (Development only)
                    const gmailApi = await getGmailApiClient(oAuth2Client, currentUser)
                    const emails = await getOnboardingMail(gmailApi, inboxFilter)
                    sortedEmails = await newToOldMailSort(emails) //emails sorted (latest -> oldest)
                }).catch(error => {
                    onboardingQueue.resume()
                    console.error('Error occured while queue was paused:', error)
                })

            // un-pause redis queue b/c we're done using gmail api
            // add user to the end of the queue
            onboardingQueue.resume()
            // console.log('Queue was resumed') (Development only)


            // use mutex key to prevent race condition from causing bad gateway error in createColelction
            const release = await qdrantLock.acquire()
            // console.log(`qdrant lock acquired for: ${emailAddress}`) (Development only)
            await createQdrantCollection(emailAddress)
            console.log(`Collection "${emailAddress}" created!`)


            for (let email of sortedEmails) {
                const unixTimestamp = Math.floor(email.sentDate.getTime() / 1000)
                addEmailtoQdrant(emailAddress, email.sender, email.subject, email.body, email.gmailId, unixTimestamp)
            }

            release()
            // console.log(`qdrant lock released for: ${emailAddress}`) (Development only)

            await User.findByIdAndUpdate(
                userId,
                {
                    oldestEmail: sortedEmails[sortedEmails.length - 1].sentDate,
                    isOnboarded: true,
                    emails: sortedEmails,
                }
            )

            /*
            Add user to Bull Queue so remaining onobarding is finished on server
            I do this so client doesn't have to wait on loading screen for 750 emails to be loaded
            */
            onboardingQueue.add('onboarding', { userId: userId }, { removeOnComplete: true, removeOnFail: true })
                .then(async (job) => {
                    await User.findByIdAndUpdate(userId, {
                        onboardingQueueId: job.id
                    })
                })

            // console.log(`Finished onboarding for ${emailAddress}`) (Development only)
            res.status(200).send('Success: Onboarding Complete')

        } else if (isOnboarded) {
            return res.status(409).send(`Did Not Execute: User '${emailAddress}' is already onboarded`)
        } else if (!currentUser.inboxFilter) {
            return res.status(428).send(`Did Not Execute: User '${emailAddress} needs to fill out the onboarding form first '/onboarding/form' `)
        }

    } catch (e) {
        console.error('[POST /onboarding/loading] Error during onboarding:', e)
        res.status(500).json('Something went wrong with the onboarding process. Try again later')
    }
})

onboardingRouter.post('/form', async (req, res) => {
    try {
        const { filterPreferences, gmailLinkId } = req.body
        const currentUser = req.user

        let queryString = 'in:inbox '

        for (const category in filterPreferences) {
            if (filterPreferences[category] === false) {
                queryString += `-category:${category} `
            }
        }

        await User.findByIdAndUpdate(currentUser.id, { inboxFilter: queryString, gmailLinkId: gmailLinkId })

        // console.log('User updated with filter preferences:', queryString) (Development Only)
        // console.log('User updated with gmail link id:', gmailLinkId) (Development Only)
        res.status(200).json({ message: 'Filter preferences updated successfully' })
    } catch (e) {
        console.error('[POST /onboarding/form] Error updating filter preferences or gmail link id:', e)
        res.status(500).send('Something went wrong while submitting form')
    }

})

onboardingRouter.patch('/reset', async (req, res) => {
    try {
        const userId = req.user.id
        const { emailAddress, onboardingQueueId } = req.user
        const job = await onboardingQueue.getJob(onboardingQueueId)
        // console.log(onboardingQueue.getJobCounts()) (Development Only)

        if ((job && job.isActive) || (job && job.isPaused)) {
            // console.log(`Job ${onboardingQueueId} is still active`) (Development Only)
            return res.status(503).send('Please wait until your gmail database has finished loading before resetting your filter preferences')
        }
        else {
            await User.findByIdAndUpdate(
                userId,
                {
                    isOnboarded: false,
                    emails: []
                },
                { new: true }
            )
            await deleteQdrantCollection(emailAddress)
            res.status(200).send('Onboarding process was successfully reset')
        }
    } catch (e) {
        console.error('[PATCH /onboarding/reset] Error resetting onboarding status:', e)
        res.status(500).send('Something went wrong while resetting onboarding status')
    }
})

onboardingRouter.get('/onboarded-status', onboardingCheck, (req, res) => {
    res.status(200).send('User is onboarded')
})


module.exports = onboardingRouter