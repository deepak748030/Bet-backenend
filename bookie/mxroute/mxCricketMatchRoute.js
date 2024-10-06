const express = require('express');
const { createCricketMatch, getCricketMatchByUserId, searchMatches } = require('../mxcontrollers/mxCricketMatchController');
const router = express.Router();



// POST request to create a new match
router.post('/matches', createCricketMatch);

// POST request to create a new match
router.get('/matches/:userId', getCricketMatchByUserId);

// Define the search route
router.get('/searchMatches', searchMatches);

module.exports = router;
