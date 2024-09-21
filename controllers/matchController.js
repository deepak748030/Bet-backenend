const axios = require('axios');
const NodeCache = require('node-cache');
const Match = require('../models/matchModels');

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

module.exports = { getUpcomingMatches };
