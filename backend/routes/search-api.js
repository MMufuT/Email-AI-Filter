const express = require('express');
const searchRouter = express.Router();
const Search = require('../models/historySchema');
const User = require('../models/userSchema');
const searchHistory = require('../models/historySchema');
const passport = require('passport');
const authCheck = require('../auth/auth-check');
const { google } = require('googleapis');
const { getGmailApiClient, loadMailToDB, getOnboardingMail, newToOldMailSort } = require('../utils/gmail-functions');
const getOAuthClient = require('../utils/get-oauth')
const { getSearchResults } = require('../utils/embedding-functions')




searchRouter.use(authCheck)

searchRouter.get('/', async (req, res) => {
    const user = req.user
    // const { searchConfig } = req.searchConfig
    // const senderAddress = searchCongi.senderAddress
    const query = `career related emails` //searchConfig.query
    const range = { before: null, after: null } //searchConfig.range
    const { emailAddress, emails, gmailLinkId } = user
    // const results = await getSearchResults(emailAddress, query, `service@paypal.com`, range)
    const rawSearchResults = await getSearchResults(emailAddress, query, null, range)
    const searchResults = rawSearchResults.map((data) => {
        const email = emails.find(email => email.gmailId === data.payload.gmailId)
        return {
            sender: email.sender,
            subject: email.subject,
            body: email.body,
            emailLink: `https://mail.google.com/mail/u/${gmailLinkId}/#inbox/${email.gmailId}`
        }
    })

    searchHistory.create({
        userId: user.id,
        userEmailAddress: user.emailAddress,
        query: query,
        results: searchResults
    })

    res.json({ email: emailAddress, results: searchResults })
});



module.exports = searchRouter;