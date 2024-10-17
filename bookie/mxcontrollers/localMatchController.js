const LocalMatch = require('../mxmodels/mxLocalMatchesModel');

// Controller to create a new local match
const createLocalMatch = async (req, res) => {
    try {
        const {
            matchId, series, matchType, matchDate, matchTime, matchStatus, venue,
            teamA, teamB, favTeam, seriesType, seriesId, venueId, isHundred, maxRate, minRate, dateWise, matchs
        } = req.body;

        // Validate required fields
        if (!matchId || !teamA || !teamB) {
            return res.status(400).json({ msg: 'Match ID, Team A, and Team B are required.' });
        }

        // Create a new match
        const newMatch = new LocalMatch({
            matchId,
            series,
            matchType,
            matchDate,
            matchTime,
            matchStatus,
            venue,
            teamA,
            teamB,
            favTeam,
            seriesType,
            seriesId,
            venueId,
            isHundred,
            maxRate,
            minRate,
            dateWise,
            matchs
        });

        // Save the match to the database
        await newMatch.save();

        return res.status(201).json({
            msg: 'Local match created successfully.',
            data: newMatch
        });
    } catch (error) {
        console.error('Error creating local match:', error.message);
        return res.status(500).json({
            msg: 'Error creating local match.',
            error: error.message
        });
    }
};

// Controller to get all local matches
const getAllLocalMatches = async (req, res) => {
    try {
        // Fetch all local matches from the database
        const matches = await LocalMatch.find();

        return res.status(200).json({
            msg: 'Local matches retrieved successfully.',
            data: matches
        });
    } catch (error) {
        console.error('Error fetching local matches:', error.message);
        return res.status(500).json({
            msg: 'Error fetching local matches.',
            error: error.message
        });
    }
};

const getLocalMatchByMatchId = async (req, res) => {
    try {
        const { matchId } = req.params;

        // Find the local match by matchId
        const localMatch = await LocalMatch.findOne({ matchId: matchId });

        if (!localMatch) {
            return res.status(404).json({
                msg: 'Local match not found for the given match ID'
            });
        }

        return res.status(200).json({
            msg: 'Local match retrieved successfully',
            data: localMatch
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error fetching local match',
            error: error.message
        });
    }
};

module.exports = { createLocalMatch, getAllLocalMatches, getLocalMatchByMatchId };
