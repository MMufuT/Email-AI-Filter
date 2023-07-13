const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    picture: String
}); 

module.exports = mongoose.model('user', userSchema);