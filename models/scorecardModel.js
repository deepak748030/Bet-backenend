// models/DataModel.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    data: {
        type: mongoose.Schema.Types.Mixed, // Allows any type of data
        required: true
    }
}, { timestamps: true }); // Optional: add timestamps for createdAt and updatedAt

const ScoreCard = mongoose.model('Scorecard', scoreSchema);

module.exports = ScoreCard;
