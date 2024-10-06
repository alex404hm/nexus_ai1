// Path: backend/models/statsModel.js

const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    totalUsers: {
        type: Number,
        required: true,
        default: 0,
    },
    ordbogSearch: {
        type: Number,
        required: true,
        default: 0,
    },
    chatbotMessages: {
        type: Number,
        required: true,
        default: 0,
    },
});

// Create the Stats model
const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
