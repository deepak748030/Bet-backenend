const Spot = require('../models/spotModels');

// Create a new spot
const createSpot = async (req, res) => {
    // Destructure properties from request body
    const { totalSpot, matchId, contestId, commission, amount } = req.body;

    // Validate input data
    if (!totalSpot || typeof totalSpot !== 'number' || totalSpot <= 0) {
        return res.status(400).json({
            msg: 'Total spot is required and must be a positive number.',
            status: false,
        });
    }

    if (!matchId || typeof matchId !== 'string' || matchId.trim() === '') {
        return res.status(400).json({
            msg: 'Match ID is required and must be a valid non-empty string.',
            status: false,
        });
    }

    if (!contestId || typeof contestId !== 'string' || contestId.trim() === '') {
        return res.status(400).json({
            msg: 'Contest ID is required and must be a valid non-empty string.',
            status: false,
        });
    }

    if (commission === undefined || typeof commission !== 'number' || commission < 0) {
        return res.status(400).json({
            msg: 'Commission is required and must be a non-negative number.',
            status: false,
        });
    }

    if (amount === undefined || typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({
            msg: 'Amount is required and must be a non-negative number.',
            status: false,
        });
    }

    try {
        // Create a new spot instance
        const newSpot = new Spot({ totalSpot, matchId, contestId, commission, amount });

        // Save the new spot to the database
        await newSpot.save();

        // Respond with success message and data
        return res.status(201).json({
            msg: 'Spot created successfully.',
            status: true,
            data: newSpot,
        });
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error('Error creating spot:', error.message);
        return res.status(500).json({
            msg: 'Error creating spot. Please try again later.',
            status: false,
            error: error.message,
        });
    }
};

// Get spot by matchId
const getSpotByMatchId = async (req, res) => {
    const { matchId } = req.params;

    try {
        // Find spots based on the provided matchId
        const spots = await Spot.find({ matchId });

        // If no spots found, return a 404 error
        if (!spots || spots.length === 0) {
            return res.status(404).json({
                msg: 'No spots found for the given match ID.',
                status: false,
            });
        }

        // Respond with the found spots
        return res.status(200).json({
            msg: 'Spots found successfully.',
            status: true,
            data: spots,
        });
    } catch (error) {
        // Log and return server error
        console.error('Error fetching spots:', error.message);
        return res.status(500).json({ error: 'Error fetching spots' });
    }
};



module.exports = { createSpot, getSpotByMatchId };
