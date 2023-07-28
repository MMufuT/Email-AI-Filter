require('dotenv').config();
const express = require('express');
const onboardingRouter = express.Router();
const User = require('../models/userSchema');
const createEmbedding = require('../utils/create-embedding')
const { google } = require('googleapis');
const { getGmailApiClient, getOnboardingMail, newToOldMailSort } = require('../utils/gmail-functions');
const { PineconeClient } = require('@pinecone-database/pinecone');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { v4: uuidv4 } = require('uuid');
const getOAuthClient = require('../utils/get-oauth')
const authCheck = require('../auth/auth-check');

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

onboardingRouter.use(authCheck)

onboardingRouter.post('/loading', async (req, res) => {
    console.log(`onboarding ${req.user}`)
    if (!req.user) {
        // If req.user is not defined or empty, handle the error
        return res.status(400).json({ error: 'User data not available.' });
    }
    try {//onboarding logic here
        const currentUser = req.user
        const { isOnboarded, emailAddress } = currentUser
        if (!isOnboarded && currentUser.inboxFilter) {
            //onboarding logic

            // pause redis queue

            // get last 250 gmails
            const inboxFilter = currentUser.inboxFilter
            const oAuth2Client = getOAuthClient(currentUser)



            const gmailApi = getGmailApiClient(oAuth2Client, currentUser)
            const emails = await getOnboardingMail(gmailApi, inboxFilter)
            newToOldMailSort(emails) //emails sorted (latest -> oldest)

            // un-pause redis queue b/c we're done using gmail api

            try {
                qdrant.createCollection(emailAddress, {
                    vectors: {
                        size: 1536,
                        distance: 'Cosine'
                    }

                })
            } catch (error) {
                console.error('Error occurred during upsert:', error.message);
                return res.status(500).json({ error: 'An error occured while creating Qdrarnt Vector Database collection' })
            }


            for (let email of emails) {
                input = `The following text is an email...\n\nSender: ${email.sender}
                \n\nSubject: ${email.subject}\n\nBody: ${email.body}`
                const embedding = await createEmbedding(input) //embedding is an array

                qdrant.upsert(emailAddress, {
                    points: [{
                        id: uuidv4(), // Universally Unique Identifier
                        vector: embedding,
                        payload: {
                            sender: email.sender,
                            gmailId: email.gmailId,
                            sentDate: email.sentDate
                        }
                    }]
                })
            }


            await User.findByIdAndUpdate(
                currentUser.id,
                {
                    latestEmail: emails[0].sentDate,
                    isOnboarded: true,
                    emails: emails,
                }
            );
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

onboardingRouter.get('/onboarded-status', (req, res) => {
    if (req.user.isOnboarded) {
        res.status(200).json({ onboarded: true });
    } else {
        res.status(200).json({ onboarded: false });
    }
});





module.exports = onboardingRouter;