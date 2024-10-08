const mongoose = require('mongoose');

const bookieSchema = new mongoose.Schema({
    totalSpot: {
        type: Number,
        required: true,
    },
    availableSpots: {
        type: Number,
        required: true,
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
    multiPoint: {
        type: Number,
        required: true,
    },
    bookieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MxUser', // Assuming 'User' is the model for users
        required: true,
    },
    selectedTeamId: {
        type: String, // Assuming team ID is a string
        required: true,
    },
}, { timestamps: true });

const Bookie = mongoose.model('Bookie', bookieSchema);

module.exports = Bookie;
