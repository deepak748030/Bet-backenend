const mongoose = require('mongoose');

// Define the schema for LocalSquad
const localSquadSchema = new mongoose.Schema({
    data: {
        type: Object, // This allows storing any object structure in the 'data' field
        required: true
    }
}, { timestamps: true }); // This adds createdAt and updatedAt timestamps automatically

// Create the LocalSquad model
const LocalSquad = mongoose.model('LocalSquad', localSquadSchema);

module.exports = LocalSquad;
