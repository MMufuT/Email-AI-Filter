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


onboardingRouter.get('/', async (req, res) => {
    console.log(`onboarding ${req.user}`)
    if (!req.user) {
        // If req.user is not defined or empty, handle the error
        return res.status(400).json({ error: 'User data not available.' });
    }
    try {//onboarding logic here
        const currentUser = req.user
        const { isOnboarded, emailAddress } = currentUser
        if (!isOnboarded) {
            //onboarding logic

            // pause redis queue

            // get last 250 gmails
            const oAuth2Client = getOAuthClient(currentUser)



            const gmailApi = getGmailApiClient(oAuth2Client, currentUser)
            const emails = await getOnboardingMail(gmailApi)
            newToOldMailSort(emails) //emails sorted (latest -> oldest)

            // un-pause redis queue b/c we're done using gmail api

            try{
                qdrant.createCollection(emailAddress, {
                    vectors: {
                        size: 1536,
                        distance: 'Cosine'
                    }
    
                })
            } catch(error){
                console.error('Error occurred during upsert:', error.message);
            }
            

            for (let email of emails) {
                input = `The following text is an email...\n\nSender: ${email.sender}\n\nSubject: ${email.subject}\n\nBody: ${email.body}`
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
            console.log('\nUser updated with onboarding data:\n')

        }

        console.log('finished onboarding')
    } catch (error) {
        console.error('Error during onboarding:', error);
        res.status(500).json({ error: 'An error occurred during onboarding' });
    }
    res.status(200).send('Success: Onboarding Complete')


})





module.exports = onboardingRouter;