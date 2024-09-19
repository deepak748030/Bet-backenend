const express = require('express');
const router = express.Router();
const { transactionAdd, transactionUpdate, betTransaction, refundTransaction } = require('../controllers/transactionControllers');

// Add a new transaction
router.post('/add', transactionAdd);

// Update transaction status
router.put('/update/:transactionId', transactionUpdate);

// Place a Bet
router.post('/bet', betTransaction);

// Issue a Refund
router.post('/refund', refundTransaction);

module.exports = router;
