const express = require('express')
const searchRouter = express.Router()
const searchHistory = require('../models/historySchema')
const authCheck = require('../auth/auth-check')
const { getSearchResults } = require('../utils/embedding-functions')
const { formatDate } = require('../utils/unix-to-string')
const onboardingCheck = require('../auth/onboarding-check')

searchRouter.use(authCheck)
searchRouter.use(onboardingCheck)

searchRouter.post('/', onboardingCheck, async (req, res) => {
    try {

        const user = req.user
        const searchConfig = req.body
        const senderAddress = searchConfig.senderAddress
        const query = searchConfig.query
        const range = searchConfig.range
        const { emailAddress, emails, gmailLinkId } = user
        const rawSearchResults = await getSearchResults(emailAddress, query, senderAddress, range)

        const searchResults = rawSearchResults.map((data) => {
            const email = emails.find(email => email.gmailId === data.payload.gmailId)
            return {
                sender: email.sender,
                subject: email.subject,
                body: email.body,
                emailLink: `https://mail.google.com/mail/u/${gmailLinkId}/#inbox/${email.gmailId}`
            }
        })

        const existingSearch = await searchHistory.findOne({
            userId: user.id,
            userEmailAddress: user.emailAddress,
            query: query,
            // Add additional conditions to check for sender and date range if needed
        })

        if (existingSearch) {
            existingSearch.updatedAt = new Date()
            await existingSearch.save()
        } else {
            searchHistory.create({
                userId: user.id,
                userEmailAddress: user.emailAddress,
                query: query,
            })
        }

        if (searchConfig.range.after) {
            searchConfig.range.after = formatDate(searchConfig.range.after)
        }

        if (searchConfig.range.before) {
            searchConfig.range.before = formatDate(searchConfig.range.before)
        }

        res.json({ email: emailAddress, searchConfig: searchConfig, results: searchResults })
    } catch (e) {
        console.error('Error occcured while searching for emails')
        res.status(500).send('Something went wrong while searching for emails')
    }
})



module.exports = searchRouter