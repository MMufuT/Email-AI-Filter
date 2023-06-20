const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    query: {
        type: String,
        required: "true"
    },

    results: {
        type: [{sender: String, subject: String, body: String}],
        required: "true",
        validate: {
            validator: function (value) {
              return value && value.length > 0;
            },
            message: 'Results field is required.',
        },
    }
    


},
{timestamps: true});

module.exports = mongoose.model('searchSchema', searchSchema);

