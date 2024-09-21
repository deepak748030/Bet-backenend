const mongoose = require('mongoose');

// Define the match schema
const matchSchema = new mongoose.Schema({
    matchId: {
        type: Number,
        required: true,
        unique: true,
    },
    series: String,
    matchType: String,
    matchDate: String,
    matchTime: String,
    matchStatus: String,
    venue: String,
    teamA: String,
    teamAShort: String,
    teamAId: Number,
    teamAImg: String,
    teamB: String,
    teamBShort: String,
    teamBId: Number,
    teamBImg: String,
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

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
