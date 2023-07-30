require('dotenv').config()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/userSchema');
const createEmbedding = require('../utils/embedding-functions')
const { google } = require('googleapis');
const { getGmailApiClient, getOnboardingMail, newToOldMailSort } = require('../utils/gmail-functions');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { v4: uuidv4 } = require('uuid');


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
                

                User.create({
                    username: profile.displayName,
                    googleId: profile.id,
                    picture: profile.photos[0].value,
                    emailAddress: profile.emails[0].value,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    isOnboarded: false,
                }).then((createdUser) => {
                    console.log('\nnew user created: ' + createdUser + '\n');
                    done(null, createdUser);
                })

            }
        })


        console.log('passport callback function fired');


    })
)