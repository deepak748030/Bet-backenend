const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
    totalSpot: {
        type: Number,
        required: true,
    },
    matchId: {
        type: String,
        required: true,
    },
    contestId: {
        type: String,
        required: true,
    },
    commission: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,   // Add this field for amount
        required: true,
    },
}, { timestamps: true });

const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;
