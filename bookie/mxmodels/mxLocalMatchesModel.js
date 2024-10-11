const mongoose = require('mongoose');

// Define the local match schema
const localMatchSchema = new mongoose.Schema({
    matchId: {
        type: Number
    },
    series: String,
    matchType: String,
    matchDate: String,
    matchTime: String,
    matchStatus: String,
    venue: String,
    teamA: {
        name: String,
        short: String,
        id: Number,
        img: String,
    },
    teamB: {
        name: String,
        short: String,
        id: Number,
        img: String,
    },
    favTeam: String,
    seriesType: String,
    seriesId: Number,
    venueId: Number,
    isHundred: Boolean,
    maxRate: String,
    minRate: String,
    dateWise: String,
    matchs: String,
});

// Create the model
const LocalMatch = mongoose.model('LocalMatch', localMatchSchema);

module.exports = LocalMatch;
