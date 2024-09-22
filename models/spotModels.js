const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
    totalSpot: {
        type: Number,
        required: true,
    },
    availableSpots: {
        type: Number,
        required: true, // Ensure available spots is required and tracked
    },
    matchId: {
        type: String,
        required: true,
    },
    commission: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;
