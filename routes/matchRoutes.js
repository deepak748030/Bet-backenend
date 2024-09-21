const express = require('express');
const router = express.Router();
const { getUpcomingMatches } = require('../controllers/matchController');

// Define the route for fetching upcoming matches
router.get('/upcomingmatches', getUpcomingMatches);

module.exports = router;
