const Match = require('../../models/matchModels');
const CricketMatch = require('../mxmodels/mxCricketMatchModel');  // Update the model name here


// Get matches by User ID and where isMatchFinished is true
const getCricketMatchByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find matches by userId and where isMatchFinished is true
        const cricketMatches = await CricketMatch.find({
            userId,
            isMatchFinished: false // Only return matches that are finished
        })
            .populate('contestId', '-__v')  // Populates data from Contest model, excluding __v field
            .populate('userId', '-password -__v');  // Populates data from User model, excluding password and __v

        // If no matches are found, return a 404 error
        if (!cricketMatches || cricketMatches.length === 0) {
            return res.status(404).json({
                msg: 'No finished cricket matches found for the given user ID.',
                status: false,
            });
        }

        // Respond with the found matches, including populated contestId and userId data
        return res.status(200).json({
            msg: 'Finished cricket matches found successfully.',
            status: true,
            data: cricketMatches,
        });
    } catch (error) {
        console.error('Error fetching cricket matches:', error.message);

        // Handle invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Invalid user ID.',
                status: false,
            });
        }

        // Handle server error
        return res.status(500).json({
            msg: 'Error fetching cricket matches.',
            status: false,
            error: error.message,
        });
    }
};


const createCricketMatch = async (req, res) => {
    try {
        const {
            matchId,
            series,
            matchType,
            matchDate,
            matchTime,
            venue,
            teamA,
            teamB,
            seriesType,
            dateWise,
            contestId,
            userId,
            selectedTeam, // Ensure this is correctly passed
            selectedPlayers // Ensure selected players are passed
        } = req.body;

        // Validate required fields
        if (!matchId || !series || !matchType || !matchDate || !matchTime || !venue || !teamA || !teamB || !seriesType || !dateWise || !contestId || !userId || !selectedTeam) {
            return res.status(400).json({ msg: 'All fields are required, including selected team.' });
        }

        // Determine if the selected team is Team A or Team B
        const isTeamASelected = selectedTeam.id === teamA.id;
        const selectedTeamId = selectedTeam.id;
        const oppositeTeamId = isTeamASelected ? teamB.id : teamA.id;

        // Check if there are existing bets for the opposite team in the same contest
        const oppositeTeamBet = await CricketMatch.findOne({
            contestId,
            'selectedTeam.id': oppositeTeamId,
            isBetAccepted: false // Only check for unaccepted bets
        });

        // Initialize isBetAccepted based on whether an opposite team bet exists
        let isBetAccepted = false;

        if (oppositeTeamBet) {
            // If opposite team bet exists, set isBetAccepted to true for both teams
            isBetAccepted = true;

            // Update the opposite team's bet to accept it
            await CricketMatch.updateOne(
                { _id: oppositeTeamBet._id },
                { $set: { isBetAccepted: true } }
            );
        }

        // Create a new match instance
        const newCricketMatch = new CricketMatch({
            matchId,
            series,
            matchType,
            matchDate,
            matchTime,
            venue,
            teamA,
            teamB,
            seriesType,
            dateWise,
            contestId,
            userId,
            selectedTeam, // Include the selectedTeam field in the match creation
            selectedPlayers, // Include selectedPlayers field
            isBetAccepted // Set based on the presence of an opposite team bet
        });

        // Save the new match (bet) to the database
        await newCricketMatch.save();

        // Respond with the created match
        return res.status(201).json({
            msg: 'Cricket match created successfully.',
            status: true,
            data: newCricketMatch
        });
    } catch (error) {
        console.error('Error creating cricket match:', error.message);
        return res.status(500).json({
            msg: 'Error creating cricket match.',
            status: false,
            error: error.message
        });
    }
};





// Controller to search matches
const searchMatches = async (req, res) => {
    try {
        const { query } = req.query; // Get search query from URL query params

        if (!query) {
            return res.status(400).json({
                msg: 'Please provide a search query.',
                status: false,
            });
        }

        // Perform search in the database
        const matches = await Match.find({
            $or: [
                { 'teamA.name': { $regex: query, $options: 'i' } },  // Search by team A name
                { 'teamB.name': { $regex: query, $options: 'i' } },  // Search by team B name
                { series: { $regex: query, $options: 'i' } },         // Search by series name
                { venue: { $regex: query, $options: 'i' } },          // Search by venue
                { matchType: { $regex: query, $options: 'i' } },      // Search by match type
            ]
        });

        if (matches.length === 0) {
            return res.status(404).json({
                msg: 'No matches found for the given query.',
                status: false,
            });
        }

        // Return found matches
        return res.status(200).json({
            msg: 'Matches found.',
            status: true,
            data: matches,
        });

    } catch (error) {
        console.error('Error searching matches:', error.message);
        return res.status(500).json({
            msg: 'Error searching matches.',
            status: false,
            error: error.message,
        });
    }
};




module.exports = { createCricketMatch, getCricketMatchByUserId, searchMatches };
