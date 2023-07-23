require('dotenv').config()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/userSchema');
const createEmbedding = require('../utils/create-embedding')
const { google } = require('googleapis');
const { getGmailApiClient, getOnboardingMail, newToOldMailSort } = require('../utils/gmail-functions');
const { PineconeClient } = require('@pinecone-database/pinecone');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { v4: uuidv4 } = require('uuid');



const qdrant = new QdrantClient({
    url: 'https://1a0b477c-f3bf-4cf3-9fbf-5af23740228d.us-east-1-0.aws.cloud.qdrant.io:6333',
    apiKey: process.env.QDRANT_API_KEY,
});




// Function to refresh the access token using the refresh token
async function refreshAccessToken(refreshToken) {
    const oAuth2Client = new google.auth.OAuth2({
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        redirectUri: '/auth/google/redirect',
    });

    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    try {
        const { token } = await oAuth2Client.getAccessToken();
        return token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
})

passport.use(
    new GoogleStrategy({
        //options for the strategy
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log(profile)
        const emailAddress = profile.emails[0].value

        // check if user exists in database
        User.findOne({ googleId: profile.id }).then(async (currentUser) => {

            if (currentUser) {
                // if user already exists
                console.log('\nuser alredy exists: ' + currentUser.username + '\n');
                console.log(refreshToken)
                currentUser.accessToken = accessToken;
                currentUser.refreshToken = refreshToken;
                done(null, currentUser);
            } else {
                // if user doesn't exist

                // pause redis queue

                // get last 250 gmails
                const oAuth2Client = new google.auth.OAuth2(
                    process.env.OAUTH_CLIENT_ID,
                    process.env.OAUTH_CLIENT_SECRET,
                    'http://localhost:8000/auth/google/redirect'
                );
                oAuth2Client.setCredentials({
                    access_Token: accessToken,
                    refresh_token: refreshToken
                });



                const gmailApi = google.gmail({ version: 'v1', auth: oAuth2Client });
                const emails = await getOnboardingMail(gmailApi)
                newToOldMailSort(emails) //emails sorted (latest -> oldest)
                
                // un-pause redis queue b/c we're done using gmail api

                qdrant.createCollection(emailAddress, {
                    vectors: {
                        size: 1536,
                        distance: 'Cosine'
                    }

                })

                for (let email of emails) {
                    input = `The following text is an email...\n\nSender: ${email.sender}\n\nSubject: ${email.subject}\n\nBody: ${email.body}`
                    const embedding = await createEmbedding(input) //embedding is an array
                    //     const pineconeResult = await pineconeIndex.upsert({
                    //         upsertRequest: {
                    //             vectors: [{
                    //                 id: email.gmailId,
                    //                 values: embedding,
                    //                 metadata: {
                    //                     user: profile.emails[0].value
                    //                 }
                    //             }]
                    //         }
                    //     })
                    // }

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

                User.create({
                    username: profile.displayName,
                    googleId: profile.id,
                    picture: profile.photos[0].value,
                    email: profile.emails[0].value,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    latestEmail: emails[0].sentDate,
                    emails: emails
                }).then((createdUser) => {
                    console.log('\nnew user created: ' + createdUser + '\n');
                    done(null, createdUser);
                })

            }
        })


        console.log('passport callback function fired');


    })
)