require('dotenv').config();
const Queue = require('bull');
const Redis = require('redis');
const { google } = require('googleapis');

const redisClient = Redis.createClient({
    password: process.env.REDIS_KEY,
    socket: {
        host: 'redis-15768.c11.us-east-1-2.ec2.cloud.redislabs.com',
        port: 15768
    }
});

const queue = new Queue('my-queue', {
    createClient: () => redisClient,
});

queue.process((job) => {
    // Process the job
    // user will have access and refresh tokens. get gmail api client with those
    // set ratelimiter on gmail api to 40 req/second
    
    /*
    - if first time user, transfer entire gmail

    - if old user, transfer all emails not currently in db
    */

    /*
    For each email...
    1. get embedding with openAI API
    2. store embedding along with gmail ID into pinecone db
    3. store sender, subject, body snippet, and gmailID in mongoDB
    */
});

// Event handling
queue.on('completed', (job) => {
    // Handle job completion event
});

queue.on('failed', (job, error) => {
    // Handle job failure event
});

module.exports = queue;