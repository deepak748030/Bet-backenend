const Spot = require('../models/spotModels');

// Create a new spot
const createSpot = async (req, res) => {
    const { totalSpot, matchId, commission, amount } = req.body;
    console.log(totalSpot, matchId, commission, amount)
    // Validate input data
    if (!totalSpot || totalSpot <= 0) {
        return res.status(400).json({
            msg: 'Total spot is required and must be a positive number.',
            status: false,
        });
    }

    if (!matchId) {
        return res.status(400).json({
            msg: 'Match ID is required and must be a valid non-empty string.',
            status: false,
        });
    }

    if (commission === undefined || commission < 0) {
        return res.status(400).json({
            msg: 'Commission is required and must be a non-negative number.',
            status: false,
        });
    }

    if (amount === undefined || amount < 0) {
        return res.status(400).json({
            msg: 'Amount is required and must be a non-negative number.',
            status: false,
        });
    }

    try {
        // Set availableSpots initially to the totalSpot value
        const newSpot = new Spot({
            totalSpot,
            availableSpots: totalSpot, // Initially, available spots equal total spots
            matchId,
            commission,
            amount,
        });

        // Save the new spot to the database
        await newSpot.save();

        // Respond with success message and data
        return res.status(201).json({
            msg: 'Spot created successfully.',
            status: true,
            data: newSpot,
        });
    } catch (error) {
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
        console.error('Error fetching spots:', error.message);
        return res.status(500).json({ error: 'Error fetching spots' });
    }
};


// Get spot by ID
const getSpotById = async (req, res) => {
    const { id } = req.params;  // Assuming the ID is passed as a parameter in the request URL

    try {
        // Find the spot based on the provided ID
        const spot = await Spot.findById(id);

        // If no spot found, return a 404 error
        if (!spot) {
            return res.status(404).json({
                msg: 'No spot found for the given ID.',
                status: false,
            });
        }

        // Respond with the found spot
        return res.status(200).json({
            msg: 'Spot found successfully.',
            status: true,
            data: spot,
        });
    } catch (error) {
        console.error('Error fetching spot:', error.message);

        // Handle invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Invalid spot ID.',
                status: false,
            });
        }

        // Handle server error
        return res.status(500).json({
            msg: 'Error fetching spot.',
            status: false,
            error: error.message,
        });
    }
};

module.exports = { createSpot, getSpotById, getSpotByMatchId };
