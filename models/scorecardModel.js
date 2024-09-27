const mongoose = require('mongoose');

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

const fallWicketSchema = new mongoose.Schema({
    player: { type: String, required: true },
    score: { type: Number, required: true },
    over: { type: String, required: true },
    wicket: { type: String, required: true }
});

const partnershipSchema = new mongoose.Schema({
    run: { type: Number, required: true },
    player_b_id: { type: Number, required: true },
    players_name: { type: String, required: true },
    ball: { type: Number, required: true },
    player_a_id: { type: Number, required: true }
});

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

const inningSchema = new mongoose.Schema({
    bolwer: [bowlerSchema],
    fallwicket: [fallWicketSchema],
    partnership: [partnershipSchema],
    batsman: [batsmanSchema],
    team: teamSchema
});

const scorecardSchema = new mongoose.Schema({
    '1': inningSchema // This assumes you always have one inning. You can adjust if there are multiple innings.
});

const ScoreCardSchema = new mongoose.Schema({
    matchId: { type: Number, required: true },
    scorecard: scorecardSchema,
    status: { type: String, required: true } // Add status field
});

const ScoreCard = mongoose.model('ScoreCard', ScoreCardSchema);

module.exports = ScoreCard;
