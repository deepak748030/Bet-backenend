const Bookie = require('../mxmodels/mxBookieSpot'); // Import the Bookie model

// Create a new bookie
exports.createBookie = async (req, res) => {
    try {
        const { totalSpot, availableSpots, matchId, commission, amount, multiPoint, bookieId, selectedTeamId } = req.body;

        // Ensure all required fields are provided
        if (!totalSpot || !availableSpots || !matchId || !commission || !amount || !multiPoint || !bookieId || !selectedTeamId) {
            return res.status(400).json({ message: 'Please fill all the required fields' });
        }

        // Create a new bookie instance
        const newBookie = new Bookie({
            totalSpot,
            availableSpots,
            matchId,
            commission,
            amount,
            multiPoint,
            bookieId,
            selectedTeamId,
        });

        // Save the bookie to the database
        await newBookie.save();

        // Send the response back to the client
        res.status(201).json({
            success: true,
            message: 'Bookie created successfully',
            data: newBookie,
        });
    } catch (error) {
        console.error('Error creating bookie:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the bookie',
            error: error.message,
        });
    }
};
