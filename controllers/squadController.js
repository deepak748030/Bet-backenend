const mongoose = require('mongoose');
const axios = require('axios'); // Ensure axios is imported
const NodeCache = require('node-cache');

// Initialize cache with a suitable TTL
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Define a schema and model for the squad data
const squadSchema = new mongoose.Schema({
    matchId: String,
    data: Object,
});

const Squad = mongoose.model('Squad', squadSchema);

// API endpoint to get squad data
const getSquad = async (req, res) => {
    const matchId = req.params.id;

    // Check if data is in cache
    const cachedData = cache.get(matchId);
    if (cachedData) {
        return res.json({
            msg: 'Data fetched from cache.',
            status: true,
            data: cachedData,
        });
    }

    // Check if data is in the database
    try {
        const dbData = await Squad.findOne({ matchId });
        if (dbData) {
            // If found in database, store in cache and return
            cache.set(matchId, dbData.data);
            return res.json({
                msg: 'Data fetched from database.',
                status: true,
                data: dbData.data,
            });
        }

        // If not found in cache or database, fetch from the external API
        const options = {
            method: 'GET',
            url: `https://cricket-live-line1.p.rapidapi.com/match/${matchId}/squads`,
            headers: {
                'x-rapidapi-key': 'd6a439bb1fmshd0b9d1b5a439a28p123e97jsn3b9786fc696b', // Replace with your actual API key
                'x-rapidapi-host': 'cricket-live-line1.p.rapidapi.com',
            },
        };

        const response = await axios.request(options);
        console.log('API hit');
        const squadData = response.data;

        // Save data to MongoDB
        const squadEntry = new Squad({ matchId, data: squadData });
        await squadEntry.save();

        // Store in cache for future requests
        cache.set(matchId, squadData);

        return res.json({
            msg: 'Data fetched from API and saved successfully.',
            status: true,
            data: squadData,
        });
    } catch (error) {
        console.error('Error fetching squad data:', error.message);
        return res.status(500).json({ error: 'Error fetching data' });
    }
};

// Export the getSquad function
module.exports = { getSquad };
