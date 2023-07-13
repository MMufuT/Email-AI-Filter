const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/userSchema');

passport.use(
    new GoogleStrategy({
        //options for the strategy
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL:'/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function

        // check if user exists in database
        User.findOne({googleId: profile.id}).then((currentUser) => {
            
            if(currentUser){
                // if user already exists
                console.log('\nuser alredy exists: ' + currentUser.username+'\n');
            } else {
                // if user doesn't exist
                User.create({
                    username: profile.displayName,
                    googleId: profile.id,
                    picture: profile.photos[0].value
                }).then((createdUser) => {
                    console.log('\nnew user created: ' + createdUser+'\n');
                })
            }

        })


        console.log('passport callback function fired');
        
    })
)