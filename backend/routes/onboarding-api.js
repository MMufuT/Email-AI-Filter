require('dotenv').config();
const express = require('express');
const onboardingRouter = express.Router();
const User = require('../models/userSchema');
const { addEmailtoQdrant, createQdrantCollection } = require('../utils/embedding-functions')
const { google } = require('googleapis');
const { getGmailApiClient, getOnboardingMail, newToOldMailSort } = require('../utils/gmail-functions');
const { PineconeClient } = require('@pinecone-database/pinecone');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { v4: uuidv4 } = require('uuid');
const getOAuthClient = require('../utils/get-oauth')
const authCheck = require('../auth/auth-check');
const { onboardingQueue } = require('../utils/queue');
const { qdrantLock } = require('../utils/mutex')


// const qdrant = new QdrantClient({
//     url: process.env.QDRANT_URL,
//     apiKey: process.env.QDRANT_API_KEY,
// });


onboardingRouter.post('/loading', async (req, res) => {
    console.log(`onboarding ${req.user}`)
    if (!req.user) {
        // If req.user is not defined or empty, handle the error
        return res.status(400).json({ error: 'User data not available.' });
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
                const unixTimestamp = Math.floor(email.sentDate.getTime() / 1000);
                addEmailtoQdrant(emailAddress, email.sender, email.subject, email.body, email.gmailId, unixTimestamp)
            }

            release();
            console.log(`qdrant lock released for: ${emailAddress}`)

            await User.findByIdAndUpdate(
                userId,
                {
                    latestEmail: sortedEmails[0].sentDate,
                    isOnboarded: true,
                    emails: sortedEmails,
                }
            );
            onboardingQueue.add('onboarding', { userId: userId }, {removeOnComplete: true, removeOnFail: true})

            console.log('\nFinished onboarding: User updated with onboarding data:\n')
            res.status(200).send('Success: Onboarding Complete')

        } else if (isOnboarded) {
            return res.status(409).send(`Did Not Execute: User '${emailAddress}' is already onboarded`)
        } else if (!currentUser.inboxFilter) {
            return res.status(428).send(`Did Not Execute: User '${emailAddress} needs to fill out the onboarding form first '/onboarding/form' `)
        }

    } catch (error) {
        console.error('Error during onboarding:', error);
        return res.status(500).json({ error: 'An error occurred during onboarding' });
    }
})

onboardingRouter.post('/form', async (req, res) => {
    try {
        const { filterPreferences, gmailLinkId } = req.body
        const currentUser = req.user

        let queryString = 'in:inbox ';

        for (const category in filterPreferences) {
            if (filterPreferences[category] === false) {
                queryString += `-category:${category} `;
            }
        }

        await User.findByIdAndUpdate(currentUser.id, { inboxFilter: queryString, gmailLinkId: gmailLinkId });
        console.log('User updated with filter preferences:', queryString);
        console.log('User updated with gmail link id:', gmailLinkId);
        res.status(200).json({ message: 'Filter preferences updated successfully' });
    } catch (error) {
        console.error('Error updating filter preferences or gmail link id: ', error)
        res.status(500).json({ error: 'An error occured while updating filter preferences' })
    }

})

onboardingRouter.get('/onboarded-status', authCheck, (req, res) => {
    if (req.user.isOnboarded) {
        res.status(200).json({ onboarded: true });
    } else {
        res.status(200).json({ onboarded: false });
    }
});





module.exports = onboardingRouter;