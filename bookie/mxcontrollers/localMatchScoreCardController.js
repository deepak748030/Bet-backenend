const LocalMatchScoreCard = require('../mxmodels/localMatchScroreCard');

// Controller to create a new local match scorecard
const createLocalMatchScorecard = async (req, res) => {
    try {
        const { matchId, scorecard, status } = req.body;

        // Validate the required fields
        if (!matchId || !scorecard || !status) {
            return res.status(400).json({ msg: 'All fields (matchId, scorecard, status) are required.' });
        }

        // Check if the match already exists
        const existingMatch = await LocalMatchScoreCard.findOne({ matchId });
        if (existingMatch) {
            return res.status(400).json({ msg: 'Match already exists.' });
        }

        // Create a new local match scorecard
        const newScorecard = new LocalMatchScoreCard({
            matchId,
            scorecard,
            status
        });

        // Save the scorecard to the database
        await newScorecard.save();

        return res.status(201).json({
            msg: 'Local match scorecard created successfully.',
            status: true,
            data: newScorecard
        });
    } catch (error) {
        console.error('Error creating local match scorecard:', error.message);
        return res.status(500).json({
            msg: 'Error creating local match scorecard.',
            status: false,
            error: error.message
        });
    }
};

module.exports = { createLocalMatchScorecard };
