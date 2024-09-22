const express = require('express');
const router = express.Router();
const { getUpcomingMatches, createCricketMatch, getCricketMatchById } = require('../controllers/matchController');
const { getSquad } = require('../controllers/squadController');
const { createSpot, getSpotById, getSpotByMatchId } = require('../controllers/spotController');

// Define the route for fetching upcoming matches
router.get('/upcomingmatches', getUpcomingMatches);

router.get('/squad/:id', getSquad);

// POST route to create a new spot
router.post('/spots', createSpot);

// Route for getting spot by matchId (GET)
router.get('/spot/:id', getSpotById);
router.get('/spot/matchid/:matchId', getSpotByMatchId);

// POST request to create a new match
router.post('/matches', createCricketMatch);

// POST request to create a new match
router.get('/matches/:id', getCricketMatchById);

module.exports = router;
