const mongoose = require('mongoose');

// Define the team schema (reusable for teamA and teamB)
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    }
});

// Define the cricket match schema
const cricketMatchSchema = new mongoose.Schema({
    matchId: {
        type: Number,
        required: true,
        unique: true // Assuming each match has a unique matchId
    },
    series: {
        type: String,
        required: true
    },
    matchType: {
        type: String,
        enum: ['T20', 'ODI', 'Test'], // Limiting match types to valid cricket formats
        required: true
    },
    matchDate: {
        type: String,
        required: true
    },
    matchTime: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    teamA: {
        type: teamSchema, // Embedded subdocument for teamA
        required: true
    },
    teamB: {
        type: teamSchema, // Embedded subdocument for teamB
        required: true
    },
    seriesType: {
        type: String,
        required: true
    },
    dateWise: {
        type: String,
        required: true
    },
    contestId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Spot model
        ref: 'Spot', // Updated to reference Spot
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User', // Reference to User model
        required: true
    }
}, { timestamps: true });

// Create the CricketMatch model
const CricketMatch = mongoose.model('CricketMatch', cricketMatchSchema);  // Updated model name

module.exports = CricketMatch;  // Export the updated model
