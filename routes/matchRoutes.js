const express = require('express');
const router = express.Router();
const { getUpcomingMatches, createCricketMatch, getCricketMatchByUserId, searchMatches } = require('../controllers/matchController');
const { getSquad } = require('../controllers/squadController');
const { createSpot, getSpotById, getSpotByMatchId } = require('../controllers/spotController');


// POST request to create a new match
router.post('/matches', createCricketMatch);

// POST route to create a new spot
router.post('/spots', createSpot);



// Update spot by ID
router.put('/spot/:id', updateSpot);

// Delete spot by ID
router.delete('/spot/:id', deleteSpot);



// Define the route for fetching upcoming matches
router.get('/upcomingmatches', getUpcomingMatches);

router.get('/squad/:id', getSquad);

// Route for getting spot by matchId (GET)
router.get('/spot/:id', getSpotById);

router.get('/spot/matchid/:matchId', getSpotByMatchId);

// POST request to create a new match
router.get('/matches/:userId', getCricketMatchByUserId);

// Define the search route
router.get('/searchMatches', searchMatches);

module.exports = router;
