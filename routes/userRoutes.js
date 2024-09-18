const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserById } = require('../controllers/userControllers');

router.post('/signup', registerUser);

router.post('/login', loginUser);


// Get User by userId Route (GET Request)
router.get('/:id', getUserById);

module.exports = router;