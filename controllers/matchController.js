const axios = require('axios');
const NodeCache = require('node-cache');
const cron = require('node-cron');  // Install node-cron for periodic tasks
const Match = require('../models/matchModels');

// Initialize cache with a 10-minute TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Function to fetch new data and update the database
const updateMatchData = async () => {
    console.log('req hit')
    const options = {
        method: 'GET',
        url: 'https://cricket-live-line1.p.rapidapi.com/upcomingMatches',
        headers: {
            'x-rapidapi-key': 'd6a439bb1fmshd0b9d1b5a439a28p123e97jsn3b9786fc696b',
            'x-rapidapi-host': 'cricket-live-line1.p.rapidapi.com',
        },
    };

    try {
        // Fetch matches from external API
        console.log('request hit')
        const response = await axios.request(options);
        const newMatches = response.data.data;  // Assume data is in 'data'

        // Clear the database before saving new matches
        await Match.deleteMany({});


        // Save new match data to the database
        const savedMatches = await Match.insertMany(newMatches);

        // Clear the cache after database update
        cache.flushAll();

        console.log('Match data updated successfully');
        return savedMatches;
    } catch (error) {
        console.error('Error updating match data:', error.message);
    }
};

// Function to check the date and time of upcoming matches
const checkMatchTimes = async () => {
    const matches = await Match.find();


    if (!matches || matches.length === 0) {
        console.log('No matches found in the database.');
        return;
    }

    // Get the current date and time
    const now = new Date();

    // Loop through each match to compare the date and time
    for (const match of matches) {
        const matchDate = new Date(`${match.dateWise} ${match.matchTime}`);

        // If current time matches the match time, update the match data
        if (now >= matchDate) {
            console.log(`Updating match data for ${match.series} at ${match.venue}`);

            // Call the function to update match data
            await updateMatchData();
            break;
        }
    }
};

// Schedule this function to run every minute using cron
cron.schedule('* * * * *', () => {
    console.log('Checking for matches to update...');
    checkMatchTimes();
});

// Controller to handle fetching matches from cache or API
const getUpcomingMatches = async (req, res) => {
    const cacheKey = 'upcomingMatches';

    // Check if data is available in the cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return res.status(200).json({
            msg: 'Data fetched from cache.',
            status: true,
            data: cachedData,
        });
    }

    try {
        // Fetch data from the database
        const matches = await Match.find();

        // Cache the data for faster future requests
        cache.set(cacheKey, matches);

        res.status(200).json({
            msg: 'Data fetched from the database.',
            status: true,
            data: matches,
        });
    } catch (error) {
        console.error('Error fetching match data:', error.message);
        res.status(500).json({ error: 'Failed to fetch match data' });
    }
};

module.exports = { getUpcomingMatches };
