const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    picture: String,
    email: String,
    accessToken: String,
    refreshToken: String,
    emails: [{
        gmailId: String,
        sender: String,
        subject: String,
        body: String
    }]
}); 

module.exports = mongoose.model('user', userSchema);