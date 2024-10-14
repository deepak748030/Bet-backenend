const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserById, getAllUsers, toggleBlockUser, deleteUser } = require('../controllers/userControllers');

// Add a new transaction
router.post('/login', loginUser);

// Update transaction status
router.post('/signup', registerUser);

// Place a Bet
router.get('/get/:id', getUserById);

router.get('/getallusers', getAllUsers);

// Route to block/unblock a user
router.put('/block/:id', toggleBlockUser);

// Route to delete a user
router.delete('/delete/:id', deleteUser);

module.exports = router;
