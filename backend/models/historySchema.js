const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: String,
        requierd: true
    },
    userEmailAddress: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },

    results: {
        type: [{
            sender: String, 
            subject: String,
            body: String,
            emailLink: String
        }]
    }
    


},
{timestamps: true});

module.exports = mongoose.model('user-search-history', historySchema);

