require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/userSchema')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        //options for the strategy
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/redirect`
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // console.log(profile) (Development only)
        console.log('Entered Google Strategy')
        console.log('Access Token:', accessToken)
        console.log('Refresh Token:', refreshToken)
        const emailAddress = profile.emails[0].value

        // check if user exists in database
        User.findOne({ googleId: profile.id }).then(async (currentUser) => {

            if (currentUser) {
                // if user already exists
                // console.log('\nuser alredy exists: ' + currentUser.username + '\n') (Development only)
                // console.log(refreshToken) (Development only)
                currentUser.accessToken = accessToken
                currentUser.refreshToken = refreshToken
                done(null, currentUser)
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
                    // console.log('\nnew user created: ' + createdUser + '\n') (Development only) 
                    done(null, createdUser)
                })

            }
        })


        // console.log('passport callback function fired') (Development only)


    })
)