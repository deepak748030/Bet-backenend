const mongoose = require('mongoose');

// Bowler Schema
const bowlerSchema = new mongoose.Schema({
    over: { type: String, required: true },
    name: { type: String, required: true },
    maiden: { type: Number, required: true },
    run: { type: Number, required: true },
    impact_status: { type: Number, required: true },
    wicket: { type: Number, required: true },
    dot_ball: { type: Number, required: true },
    economy: { type: String, required: true },
    player_id: { type: Number, required: true }
});

// Fall Wicket Schema
const fallWicketSchema = new mongoose.Schema({
    player: { type: String, required: true },
    score: { type: Number, required: true },
    over: { type: String, required: true },
    wicket: { type: String, required: true }
});

// Partnership Schema
const partnershipSchema = new mongoose.Schema({
    run: { type: Number, required: true },
    player_b_id: { type: Number, required: true },
    players_name: { type: String, required: true },
    ball: { type: Number, required: true },
    player_a_id: { type: Number, required: true }
});

// Batsman Schema
const batsmanSchema = new mongoose.Schema({
    ball: { type: Number, required: true },
    strike_rate: { type: String, required: true },
    run: { type: Number, required: true },
    sixes: { type: Number, required: true },
    impact_status: { type: Number, required: true },
    fours: { type: Number, required: true },
    out_by: { type: String, required: true },
    name: { type: String, required: true },
    player_id: { type: Number, required: true }
});

// Team Schema
const teamSchema = new mongoose.Schema({
    over: { type: String, required: true },
    short_name: { type: String, required: true },
    extras: { type: String, required: true },
    name: { type: String, required: true },
    team_id: { type: Number, required: true },
    inning: { type: Number, required: true },
    score: { type: Number, required: true },
    flag: { type: String, required: true },
    wicket: { type: Number, required: true }
});

// Inning Schema
const inningSchema = new mongoose.Schema({
    bowler: [bowlerSchema],
    fallwicket: [fallWicketSchema],
    partnership: [partnershipSchema],
    batsman: [batsmanSchema],
    team: teamSchema
});

// Scorecard Schema
const scorecardSchema = new mongoose.Schema({
    '1': inningSchema // This assumes a single inning, adjust if necessary
});

// Main ScoreCard Schema
const LocalMatchScoreCardSchema = new mongoose.Schema({
    matchId: { type: Number, required: true },
    scorecard: scorecardSchema,
    status: { type: String, required: true } // Match status (e.g., ongoing, finished)
}, { timestamps: true });

const LocalMatchScoreCard = mongoose.model('LocalMatchScoreCard', LocalMatchScoreCardSchema);

module.exports = LocalMatchScoreCard;
