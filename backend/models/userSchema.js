const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    picture: String,
    emailAddress: String,
    accessToken: String,
    refreshToken: String,
    oldestEmail: Date,
    inboxFilter: String,
    gmailLinkId: String,
    isOnboarded: Boolean,
    onboardingQueueId: String,
    emails: [{
        gmailId: String,
        sentDate: Date,
        sender: String,
        subject: String,
        body: String
    }]
}) 

module.exports = mongoose.model('user', userSchema)