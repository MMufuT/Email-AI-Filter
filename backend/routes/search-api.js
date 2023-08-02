const express = require('express');
const searchRouter = express.Router();
const Search = require('../models/searchSchema');
const User = require('../models/userSchema');
const passport = require('passport');
const authCheck = require('../auth/auth-check');
const { google } = require('googleapis');
const { getGmailApiClient, loadMailToDB, getOnboardingMail, newToOldMailSort } = require('../utils/gmail-functions');
const getOAuthClient = require('../utils/get-oauth')






searchRouter.get('/', authCheck, async (req, res) => {
    const user = req.user
    userId = user.id
    const oAuth2Client = await getOAuthClient(user)


    //if button is pressed
    const gmailApi = await getGmailApiClient(oAuth2Client, user);
    let emails = await user.emails
    let beforeDate = emails[emails.length-1].sentDate
    beforeDate = Math.floor(beforeDate.getTime() / 1000);
    console.log(beforeDate)

    await loadMailToDB(gmailApi, beforeDate, userId)
    const updatedUser = await User.findById(userId)
    const sortedMail = await newToOldMailSort(updatedUser.emails)


    
    
    await User.findByIdAndUpdate(
        userId,
        {
            latestEmail: sortedMail[0].sentDate,
            emails: sortedMail,
        }
    );


    res.json({ mssg: 'Search Screen.. username: ' + user.username })
});

//Post a new history tab to the /history path
searchRouter.post('/', async (req, res) => {
    //const query = req.body;
    const { query, results } = req.body;

    try {

        // Create a new Search document in the history collection
        //Task: create search schema
        //Note: 'search results' will be a const
        //-----

        // const searchResults = await performSearch(query);

        // const Search = await Search.create({
        //     query: req.body,
        //     results: searchResults,
        // });

        // res.status(200).json(searchResults)

        const newSearchSchema = await Search.create({ query, results })
        res.status(200).json(newSearchSchema);

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

});



module.exports = searchRouter;