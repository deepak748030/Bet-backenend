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
}, { timestamps: true });

const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;
