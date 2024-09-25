const mongoose = require('mongoose');

// Define the banner schema
const bannerSchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing Match model
        ref: 'Match',  // Reference the Match model
        required: true,
    },
    bannerImg: {
        type: String,
        required: true,
    }
});

// Create the model
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
