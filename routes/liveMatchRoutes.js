const express = require('express');
const { getLiveMatchesAndScorecards } = require('../controllers/matchLiveController');
const router = express.Router();


router.get('/liveMatchesAndScorecards', getLiveMatchesAndScorecards);

module.exports = router;