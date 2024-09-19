const Transaction = require('../models/transcationModels');

// Add a new transaction
const transactionAdd = async (req, res) => {
  try {
    const { transactionId, userId, type, amount, message, refundDate } = req.body;

    // Ensure necessary fields are provided
    if (!transactionId || !userId || !type || !amount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newTransaction = new Transaction({
      transactionId,
      userId,
      type,
      amount,
      message,
      refundDate: type === 'refund' ? refundDate : null,
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Update transaction status
const transactionUpdate = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transactionId: req.params.transactionId },
      { status },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated', transaction: updatedTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Add a bet transaction
const betTransaction = async (req, res) => {
  try {
    const { transactionId, userId, amount, betDetails } = req.body;

    // Validate required fields
    if (!transactionId || !userId || !amount || !betDetails) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newBet = new Transaction({
      transactionId,
      userId,
      type: 'bet',
      amount,
      betDetails,
      status: 'pending',
    });

    await newBet.save();
    res.status(201).json({ message: 'Bet placed successfully', bet: newBet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place bet' });
  }
};

// Issue a refund transaction
const refundTransaction = async (req, res) => {
  try {
    const { transactionId, userId, refundAmount, originalTransactionId, message } = req.body;

    // Validate required fields
    if (!transactionId || !userId || !refundAmount || !originalTransactionId) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Find the original transaction to refund
    const originalTransaction = await Transaction.findOne({ transactionId: originalTransactionId, userId });

    if (!originalTransaction) {
      return res.status(404).json({ error: 'Original transaction not found' });
    }

    const refundTransaction = new Transaction({
      transactionId,
      userId,
      type: 'refund',
      amount: refundAmount,
      status: 'pending',
      message,
      refundDate: Date.now(),
    });

    await refundTransaction.save();
    res.status(201).json({ message: 'Refund issued successfully', refund: refundTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to issue refund' });
  }
};

module.exports = { transactionAdd, transactionUpdate, betTransaction, refundTransaction };
