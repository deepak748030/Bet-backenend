const express = require('express');
const { createBookie } = require('../mxcontrollers/bookieController');

const router = express.Router();

router.post('/bookie', createBookie)


module.exports = router;
