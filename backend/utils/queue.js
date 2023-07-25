require('dotenv').config();
const Queue = require('bull');
const Redis = require('redis');
const { google } = require('googleapis');
const User = require('../models/userSchema');
const { getGmailApiClient, loadMailToDB, newToOldMailSort } = require('./gmail-functions')
const getOAuthClient = require('./get-oauth')

const redisClient = Redis.createClient({
    password: process.env.REDIS_KEY,
    socket: {
        host: process.env.REDIS_HOST,
        port: 15768
    }
});

// Create the "onboardingQueue"
const onboardingQueue = new Queue('onboardingQueue', {
    createClient: () => redisClient,
});

onboardingQueue.process(async(job) => {
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
    const userId = job.data
    const user = await User.findOne({userId})
    const oAuth2Client = await getOAuthClient(user)
    const gmailApi = await getGmailApiClient(oAuth2Client, user)
});

// Event handling for "onboardingQueue"
onboardingQueue.on('completed', (job) => {
    console.log(`Job ${job.id} completed in onboardingQueue.`);
});

onboardingQueue.on('failed', (job, error) => {
    console.log(`Job ${job.id} failed in onboardingQueue with error: ${error.message}`);
});

// Create the "dbUpdateQueue"
const dbUpdateQueue = new Queue('dbUpdateQueue', {
    createClient: () => redisClient,
});

dbUpdateQueue.process((job) => {
    // Process the job for database update tasks
    
    // user will have access and refresh tokens. get gmail api client with those
    // set ratelimiter on gmail api to 10 req/second
    // get n newest emails
    // delete n oldest emails

    /*
    For each email new...
    1. get embedding with openAI API
    2. store embedding along with gmail ID into qdrant db
    3. store sender, subject, body snippet, and gmailID in mongoDB
    */

    // data = {user.id, numNewEmails}
});

// Event handling for "dbUpdateQueue"
dbUpdateQueue.on('completed', (job) => {
    console.log(`Job ${job.id} completed in dbUpdateQueue.`);
});

dbUpdateQueue.on('failed', (job, error) => {
    console.log(`Job ${job.id} failed in dbUpdateQueue with error: ${error.message}`);
});

// myQueue.pause().then(() => {
//     console.log('Queue is paused');
//   }).catch((err) => {
//     console.error('Error pausing queue:', err);
//   });


// myQueue.resume().then(() => {
//     console.log('Queue is resumed');
//   }).catch((err) => {
//     console.error('Error resuming queue:', err);
//   });

module.exports = { onboardingQueue, dbUpdateQueue };