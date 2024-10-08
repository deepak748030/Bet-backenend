const LocalSquad = require('../mxmodels/localSquadModel');

// Controller to create a new local squad
const createLocalSquad = async (req, res) => {
    try {
        const { data } = req.body;

        // Validate the required data field
        if (!data) {
            return res.status(400).json({ msg: 'Data field is required.' });
        }

        // Create a new squad instance
        const newSquad = new LocalSquad({
            data
        });

        // Save the squad to the database
        await newSquad.save();

        return res.status(201).json({
            msg: 'Local squad created successfully.',
            status: true,
            data: newSquad
        });
    } catch (error) {
        console.error('Error creating local squad:', error.message);
        return res.status(500).json({
            msg: 'Error creating local squad.',
            status: false,
            error: error.message
        });
    }
};

module.exports = { createLocalSquad };
