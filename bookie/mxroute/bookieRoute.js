const express = require('express');
const { createBookie, getBookieByMatchId } = require('../mxcontrollers/bookieController');

const router = express.Router();

router.post('/bookie', createBookie)

router.get('/bookie/:matchId', getBookieByMatchId)

module.exports = router;
