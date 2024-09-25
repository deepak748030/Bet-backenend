const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserById } = require('../controllers/userControllers');

// Add a new transaction
router.post('/login', loginUser);

// Update transaction status
router.post('/signup', registerUser);

// Place a Bet
router.get('/get/:id', getUserById);


module.exports = router;
