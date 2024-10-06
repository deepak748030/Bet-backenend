const express = require('express');
const { transactionAdd, withdrawTransaction, betTransaction, refundTransaction, getBetByUserId, getRecentTrxByUserId } = require('../mxcontrollers/mxTransactionController');
const router = express.Router();


// Add a new transaction
router.post('/add', transactionAdd);

// Withdraw transaction route
router.post('/withdraw', withdrawTransaction);

// Place a Bet
router.post('/bet', betTransaction);

// Issue a Refund
router.post('/refund', refundTransaction);

router.get('/bet/:userId', getBetByUserId)

router.get('/recent/:userId/:count', getRecentTrxByUserId)

module.exports = router;
