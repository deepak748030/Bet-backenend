const Banner = require('../models/bannerModel'); // Adjust the path as necessary
const Match = require('../models/matchModels'); // Ensure this points to your Match model

// Add a new banner
const addBanner = async (req, res) => {
    try {
        const { matchId, bannerImg } = req.body;

        // Validate required fields
        if (!matchId || !bannerImg) {
            return res.status(400).json({ error: 'Match ID and banner image are required' });
        }

        // Check if the matchId exists in the Match collection
        const matchExists = await Match.findOne({ matchId });
        // console.log(matchExists)
        if (!matchExists) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Create a new banner using the Match's _id (ObjectId) as a reference
        const newBanner = new Banner({ matchId: matchExists._id, bannerImg });
        console.log(matchExists._id)

        // Save the banner
        await newBanner.save();
        res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
    } catch (error) {
        console.error('Error creating banner:', error.message);
        res.status(500).json({ error: 'Failed to create banner', details: error.message });
    }
};

// Get all banners and populate the matchId field with full Match data
const getAllBanners = async (req, res) => {
    try {
        // Fetch all banners and populate the matchId field with full Match data
        const banners = await Banner.find().populate('matchId');

        // If no banners found, return a 404
        if (!banners.length) {
            return res.status(404).json({ message: 'No banners found' });
        }

        // Respond with the populated banners
        res.status(200).json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error.message);
        res.status(500).json({ error: 'Failed to fetch banners', details: error.message });
    }
};

// Export the controller functions
module.exports = {
    addBanner,
    getAllBanners,
};
