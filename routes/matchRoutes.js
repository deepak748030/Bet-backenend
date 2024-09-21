const express = require('express');
const router = express.Router();
const { getUpcomingMatches } = require('../controllers/matchController');
const { getSquad } = require('../controllers/squadController');
const { createSpot, getSpotByMatchId } = require('../controllers/spotController');

// Define the route for fetching upcoming matches
router.get('/upcomingmatches', getUpcomingMatches);

router.get('/squad/:id', getSquad);

// POST route to create a new spot
router.post('/spots', createSpot);

// Route for getting spot by matchId (GET)
router.get('/spot/:matchId', getSpotByMatchId);

module.exports = router;
