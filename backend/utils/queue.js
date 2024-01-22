require('dotenv').config()
const Queue = require('bull')
const { createClient } = require('redis')
const { google } = require('googleapis')
const { onboardingRateLimiter } = require('./rate-limits')
const User = require('../models/userSchema')
const { getGmailApiClient, loadMailToDB, newToOldMailSort } = require('./gmail-functions')
const getOAuthClient = require('./get-oauth')

const waitForEmptyLimiter = ((limiter, done) => {
    new Promise((resolve) => {
        limiter.on("empty", () => {
            // console.log("Rate limiter is empty.") (Development only)
            done()
            resolve()
        })
    })
})

const onboardingQueue = new Queue('onboarding-queue', {
    redis: {
        port: 15768,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD
    }
})

onboardingQueue.process('onboarding', async (job, done) => {
    // console.log(`Job ${job.id} started in onboarding-queue.`) (Development only)
    // console.log(onboardingRateLimiter.counts()) (Development only)

    // Process the job for onboarding tasks

    // user will have access and refresh tokens. get gmail api client with those
    // set ratelimiter on gmail api to 35 req/second
    // get last 750 emails

    /*
    For each email...
    1. get embedding with openAI API
    2. store embedding along with gmail ID into qdrant db
    3. store sender, subject, body snippet, gmailID, and oldestSentDate in mongoDB
    */

    try {
        // Process the job for onboarding tasks
        const { userId } = job.data
        const user = await User.findById(userId)
        const emailAddress = user.emailAddress
        const oAuth2Client = await getOAuthClient(user)
        const gmailApi = await getGmailApiClient(oAuth2Client, user)

        const emails = user.emails
        let oldestEmailDate = emails[emails.length - 1].sentDate
        oldestEmailDate = Math.floor(oldestEmailDate.getTime() / 1000) // converting to ISO format
        // console.log(oldestEmailDate) (Development only)

        const filter = user.inboxFilter + ` before:${oldestEmailDate}`
        // console.log(`Rest of emails loaded with this filter: ${filter}`) (Development only)

        // await the completion of loadMailToDB
        await loadMailToDB(gmailApi, filter, userId, emailAddress)

        const updatedUser = await User.findById(userId)
        const sortedMail = await newToOldMailSort(updatedUser.emails)
        await User.findByIdAndUpdate(userId, {
            oldestEmail: sortedMail[sortedMail.length - 1].sentDate,
            emails: sortedMail,
        })

        waitForEmptyLimiter(onboardingRateLimiter, done)
    } catch (error) {
        // Job failed, pass the error to done callback
        console.error('Error during Bull Queue onboarding process')
        done(error)
    }
})

onboardingQueue.on('completed', (job) => {
    console.log(`Job ${job.id} completed in onboardingQueue.`)
})

onboardingQueue.on('failed', (job, error) => {
    console.log(`Job ${job.id} failed in onboardingQueue with error: ${error.message}`)
})


module.exports = { onboardingQueue }