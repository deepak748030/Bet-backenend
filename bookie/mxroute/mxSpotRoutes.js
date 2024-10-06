const express = require('express');
const { createSpot, getSpotById, updateSpot, deleteSpot, getSpotByMatchId } = require('../mxcontrollers/mxSpotController');
const router = express.Router();



// POST route to create a new spot
router.post('/spots', createSpot);

// Route for getting spot by matchId (GET)
router.get('/spot/:id', getSpotById);

// Update spot by ID
router.put('/spot/:id', updateSpot);

// Delete spot by ID
router.delete('/spot/:id', deleteSpot);


router.get('/spot/matchid/:matchId', getSpotByMatchId);



module.exports = router;
