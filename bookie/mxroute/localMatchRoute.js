const express = require('express');
const router = express.Router();
const { createLocalMatch, getAllLocalMatches, getLocalMatchByMatchId } = require('../mxcontrollers/localMatchController');
const { createLocalMatchScorecard } = require('../mxcontrollers/localMatchScoreCardController');
const { createLocalSquad } = require('../mxcontrollers/localSquadController');


// POST request to create a new local match
router.post('/localmatch', createLocalMatch);

// GET request to fetch all local matches
router.get('/localmatches', getAllLocalMatches);

// router.get('/localmatch/:matchId', getLocalMatchByMatchId);


// POST route to create a new local match scorecard
router.post('/localmatchscorecard', createLocalMatchScorecard);

// POST route to create a new local squad
router.post('/localsquad', createLocalSquad);

module.exports = router;
