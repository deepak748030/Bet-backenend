const express = require('express');
const { fxLoginUser, fxRegisterUser, fxGetUserById, fxGetAllUsers } = require('../mxcontrollers/mxUserController');
const router = express.Router();


// Add a new transaction
router.post('/login', fxLoginUser);

// Update transaction status
router.post('/signup', fxRegisterUser);

// Place a Bet
router.get('/get/:id', fxGetUserById);

router.get('/getallusers', fxGetAllUsers);




module.exports = router;
