const express = require('express');
const router = express.Router();
const { transactionAdd, withdrawTransaction, betTransaction, refundTransaction } = require('../controllers/transactionControllers');

// Add a new transaction
router.post('/add', transactionAdd);

// Withdraw transaction route
router.post('/withdraw', withdrawTransaction);

// Place a Bet
router.post('/bet', betTransaction);

// Issue a Refund
router.post('/refund', refundTransaction);

module.exports = router;
