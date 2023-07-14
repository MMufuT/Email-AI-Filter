const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/userSchema');
const { google } = require('googleapis');

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

passport.deserializeUser((id, done)=> {
    User.findById(id).then((user) => {
        done(null, user);
    })
})

passport.use(
    new GoogleStrategy({
        //options for the strategy
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL:'/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log(profile)

        // check if user exists in database
        User.findOne({googleId: profile.id}).then((currentUser) => {
            
            if(currentUser){
                // if user already exists
                console.log('\nuser alredy exists: ' + currentUser.username+'\n');
                console.log(refreshToken)
                currentUser.accessToken = accessToken;
                currentUser.refreshToken = refreshToken;
                done(null, currentUser); 
            } else {
                // if user doesn't exist
                User.create({
                    username: profile.displayName,
                    googleId: profile.id,
                    picture: profile.photos[0].value,
                    email: profile.emails[0].value,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }).then((createdUser) => {
                    console.log('\nnew user created: ' + createdUser+'\n');
                    done(null, createdUser);
                })
            }

        })


        console.log('passport callback function fired');
        
        
    })
)