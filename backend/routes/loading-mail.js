const express = require('express');
const loadingMailRouter = express.Router();
const passport = require('passport');
const authCheck = require('../auth/auth-check');

loadingMailRouter.get('/', authCheck, (req, res) => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        'http://localhost:8000/auth/google/redirect'
    );
    oAuth2Client.setCredentials({
        access_Token: req.user.accessToken,
        refresh_token: req.user.refreshToken
      });

    
    //if button is pressed
    const gmailApi = getGmailApiClient(oAuth2Client, req.user);
    loadMailToDB(gmailApi);


    res.json({mssg: 'Search Screen.. username: '+req.user.username })
});


module.exports = loadingMailRouter