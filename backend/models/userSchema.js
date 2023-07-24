const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    picture: String,
    emailAddress: String,
    accessToken: String,
    refreshToken: String,
    latestEmail: Date,
    isOnboarded: Boolean,
    emails: [{
        gmailId: String,
        sentDate: Date,
        sender: String,
        subject: String,
        body: String
    }]
}); 

module.exports = mongoose.model('user', userSchema);