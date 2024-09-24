const express = require('express');
const { getLiveMatchesAndScorecards, getMatchScorecardById } = require('../controllers/matchLiveController');
const router = express.Router();


router.get('/liveMatchesAndScorecards', getLiveMatchesAndScorecards);

router.get('/liveMatchesAndScorecards/:matchId', getMatchScorecardById);

module.exports = router;