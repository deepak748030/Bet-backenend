const express = require('express');
const router = express.Router();
const { getUpcomingMatches } = require('../controllers/matchController');
const { getSquad } = require('../controllers/squadController');

// Define the route for fetching upcoming matches
router.get('/upcomingmatches', getUpcomingMatches);

router.get('/squad/:id', getSquad);

module.exports = router;
