const axios = require('axios');
const NodeCache = require('node-cache');
const Match = require('../models/matchModels');
const CricketMatch = require('../models/cricketMatchModel');  // Update the model name here

// Initialize cache with a 10-minute TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Function to fetch match data from the API
const fetchMatchData = async () => {
    console.log('Fetching match data from external API...');

    const options = {
        method: 'GET',
        url: 'https://cricket-live-line1.p.rapidapi.com/upcomingMatches',
        headers: {
            'x-rapidapi-key': 'd6a439bb1fmshd0b9d1b5a439a28p123e97jsn3b9786fc696b', // Replace with your API key
            'x-rapidapi-host': 'cricket-live-line1.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        const matches = response.data.data;

        if (!matches || matches.length === 0) {
            console.log('No data returned from the API.');
            throw new Error('No matches found.');
        }

        return matches;
    } catch (error) {
        console.error('Error fetching match data:', error.message);
        throw new Error('Failed to fetch match data.');
    }
};


// API Controller to fetch matches, save to database, and send to user
const getUpcomingMatches = async (req, res) => {
    try {
        // Check cache first
        const cachedData = cache.get('upcomingMatches');
        if (cachedData) {
            return res.status(200).json({
                msg: 'Data fetched from cache.',
                status: true,
                data: cachedData,
            });
        }

        // Fetch match data from the API
        const matchData = await fetchMatchData();

        // Clear the old data in the database
        await Match.deleteMany({});

        // Prepare matches to save in the correct format
        const matchesToSave = matchData.map(match => ({
            matchId: match.match_id,
            series: match.series,
            matchType: match.match_type,
            matchDate: match.match_date,
            matchTime: match.match_time,
            matchStatus: match.match_status,
            venue: match.venue,
            teamA: {
                name: match.team_a,
                short: match.team_a_short,
                id: match.team_a_id,
                img: match.team_a_img,
            },
            teamB: {
                name: match.team_b,
                short: match.team_b_short,
                id: match.team_b_id,
                img: match.team_b_img,
            },
            favTeam: match.fav_team,
            seriesType: match.series_type,
            seriesId: match.series_id,
            venueId: match.venue_id,
            isHundred: match.is_hundred === 1, // Assuming 1 for true
            maxRate: match.max_rate,
            minRate: match.min_rate,
            dateWise: match.date_wise,
            matchs: match.matchs,
        }));

        // Save new matches to the database
        await Match.insertMany(matchesToSave);

        // Update cache with the new matches
        cache.set('upcomingMatches', matchesToSave);

        res.status(200).json({
            msg: 'Data fetched from API and saved successfully.',
            status: true,
            data: matchesToSave,
        });
    } catch (error) {
        console.error('Error processing matches:', error.message);
        res.status(500).json({
            msg: 'Error fetching upcoming matches.',
            status: false,
            error: error.message,
        });
    }
};







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




module.exports = { getUpcomingMatches, createCricketMatch, getCricketMatchByUserId, searchMatches };
