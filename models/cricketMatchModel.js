const mongoose = require('mongoose');

// Define the player schema for selected players
const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    playerId: {
        type: Number,
        required: true
    },
    playerImg: {
        type: String,  // URL for player image
        required: true
    },
    playerShortName: {
        type: String,  // Short name for player
        required: true
    }
});

// Define the team schema (reusable for teamA, teamB, and selectedTeam)
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
        required: true
    },
    series: {
        type: String,
        required: true
    },
    matchType: {
        type: String,
        enum: ['T20', 'ODI', 'Test'],
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
        type: teamSchema,
        required: true
    },
    teamB: {
        type: teamSchema,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Spot',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // New fields
    result: {
        type: String,
        enum: ['win', 'loose', 'pending'], // Enum for result
        default: 'pending' // Default result is pending
    },
    selectedTeam: {
        type: teamSchema, // The user's selected team
        required: true
    },
    selectedPlayers: [playerSchema], // Array of players
    isBetAccepted: {
        type: Boolean,
        default: false // Default value for bet acceptance
    },
    isMatchFinished: {
        type: Boolean,
        default: false // Default value for match completion
    }
}, { timestamps: true });

// Create the CricketMatch model
const CricketMatch = mongoose.model('CricketMatch', cricketMatchSchema);

module.exports = CricketMatch;
