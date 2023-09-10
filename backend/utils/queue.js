require('dotenv').config()
const Queue = require('bull')
const { createClient } = require('redis')
const { google } = require('googleapis')
const { onboardingRateLimiter, dbUpdateRateLimiter } = require('./rate-limits')
const User = require('../models/userSchema')
const { getGmailApiClient, loadMailToDB, newToOldMailSort } = require('./gmail-functions')
const getOAuthClient = require('./get-oauth')

// this will be run in case the job is stopped midway and restarted for whatever reason
// it will make sure the resulting emails array in MongoDB has not duplicate emails
const removeDuplicates = (objectsArray) =>
    [...new Set(objectsArray.map(JSON.stringify))].map(JSON.parse)

const waitForEmptyLimiter = ((limiter, done) => {
    new Promise((resolve) => {
        limiter.on("empty", () => {
            console.log("Rate limiter is empty.")
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
    console.log(`Job ${job.id} started in onboarding-queue.`)
    console.log(onboardingRateLimiter.counts())

    // Process the job for onboarding tasks

    // user will have access and refresh tokens. get gmail api client with those
    // set ratelimiter on gmail api to 35 req/second
    // get last 4500 emails

    /*
    For each email...
    1. get embedding with openAI API
    2. store embedding along with gmail ID into qdrant db
    3. store sender, subject, body snippet, gmailID, and latestSentDate in mongoDB
    */

    // data = {user.id}
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
        console.log(oldestEmailDate)

        const filter = user.inboxFilter + ` before:${oldestEmailDate}`
        console.log(`Rest of emails loaded with this filter: ${filter}`)

        // await the completion of loadMailToDB
        await loadMailToDB(gmailApi, filter, userId, emailAddress)

        const updatedUser = await User.findById(userId)
        const sortedMail = await newToOldMailSort(updatedUser.emails)
        await User.findByIdAndUpdate(userId, {
            latestEmail: sortedMail[0].sentDate,
            emails: sortedMail,
        })

        waitForEmptyLimiter(onboardingRateLimiter, done)
    } catch (error) {
        // Job failed, pass the error to done callback
        console.log(`Error here ${error}`)
        done(error)
    }
})

// Event handling for "onboardingQueue"
onboardingQueue.on('completed', (job) => {
    console.log(`Job ${job.id} completed in onboardingQueue.`)
})

onboardingQueue.on('failed', (job, error) => {
    console.log(`Job ${job.id} failed in onboardingQueue with error: ${error.message}`)
})

// // Create the "dbUpdateQueue"
// const dbUpdateQueue = new Queue('dbUpdateQueue', {
//     createClient: () => redisClient,
// })

// dbUpdateQueue.process((job) => {
//     // Process the job for database update tasks

//     // user will have access and refresh tokens. get gmail api client with those
//     // set ratelimiter on gmail api to 10 req/second
//     // get n newest emails
//     // delete n oldest emails

//     /*
//     For each email new...
//     1. get embedding with openAI API
//     2. store embedding along with gmail ID into qdrant db
//     3. store sender, subject, body snippet, and gmailID in mongoDB
//     */

//     // data = {user.id, numNewEmails}
// })

// // Event handling for "dbUpdateQueue"
// dbUpdateQueue.on('completed', (job) => {
//     console.log(`Job ${job.id} completed in dbUpdateQueue.`)
// })

// dbUpdateQueue.on('failed', (job, error) => {
//     console.log(`Job ${job.id} failed in dbUpdateQueue with error: ${error.message}`)
// })

// // myQueue.pause().then(() => {
// //     console.log('Queue is paused')
// //   }).catch((err) => {
// //     console.error('Error pausing queue:', err)
// //   })


// // myQueue.resume().then(() => {
// //     console.log('Queue is resumed')
// //   }).catch((err) => {
// //     console.error('Error resuming queue:', err)
// //   })

module.exports = { onboardingQueue }