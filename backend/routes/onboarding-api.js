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



onboardingRouter.post('/loading', async (req, res) => {
    console.log(`started onboarding for ${req.user.emailAddress}`)
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
                    console.log(`Queue was paused for: ${emailAddress}`)
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
            console.log('Queue was resumed')


            // use mutex key to make to prevent race condition from causing bad gateway error in createColelction
            const release = await qdrantLock.acquire()
            console.log(`qdrant lock acquired for: ${emailAddress}`)
            await createQdrantCollection(emailAddress)
            console.log(`Collection "${emailAddress}" created!`)


            for (let email of sortedEmails) {
                const unixTimestamp = Math.floor(email.sentDate.getTime() / 1000)
                addEmailtoQdrant(emailAddress, email.sender, email.subject, email.body, email.gmailId, unixTimestamp)
            }

            release()
            console.log(`qdrant lock released for: ${emailAddress}`)

            await User.findByIdAndUpdate(
                userId,
                {
                    latestEmail: sortedEmails[0].sentDate,
                    isOnboarded: true,
                    emails: sortedEmails,
                }
            )
            onboardingQueue.add('onboarding', { userId: userId }, { removeOnComplete: true, removeOnFail: true })
            .then(async (job) => {
                await User.findByIdAndUpdate(userId, {
                    onboardingQueueId: job.id
                })
            })

            console.log(`Finished onboarding for ${emailAddress}`)
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
        console.log('User updated with filter preferences:', queryString)
        console.log('User updated with gmail link id:', gmailLinkId)
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
        const job = await onboardingQueue.getJob(onboardingQueueId);
        console.log("testing", onboardingQueueId)
        console.log(onboardingQueue.getJobCounts())

        if ((job && job.isActive) || (job && job.isPaused)) {
            console.log(`Job ${onboardingQueueId} is still active`)
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

onboardingRouter.get('/onboarded-status', authCheck, (req, res) => {
    try {
        if (req.user.isOnboarded) {
            return res.status(200).json({ onboarded: true })
        } else {
            return res.status(200).json({ onboarded: false })
        }
    } catch (e) {
        console.error('[GET /onboarding/onboarding-status] Error while getting onboarded status:', e)
    }
})


module.exports = onboardingRouter