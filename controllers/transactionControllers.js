const Transaction = require('../models/transcationModels');

// Add a new transaction
const transactionAdd = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;

    // Ensure necessary fields are provided
    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }

    const newTransaction = new Transaction({
      userId,
      amount,
      type: 'deposit', // Default to a deposit transaction type
      message,
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Withdraw transaction
const withdrawTransaction = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;

    // Ensure necessary fields are provided
    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }

    const newWithdraw = new Transaction({
      userId,
      amount,
      type: 'withdraw', // Set the transaction type to withdraw
      status: 'pending',
      message,
    });

    await newWithdraw.save();
    res.status(201).json({ message: 'Withdrawal transaction created successfully', transaction: newWithdraw });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create withdrawal transaction' });
  }
};

// Add a bet transaction
const betTransaction = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }

    const newBet = new Transaction({
      userId,
      amount,
      type: 'bet', // Set the transaction type to bet
      status: 'pending',
      message, // Optional field for any bet details
    });

    await newBet.save();
    res.status(201).json({ message: 'Bet placed successfully', transaction: newBet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place bet' });
  }
};

// Issue a refund transaction
const refundTransaction = async (req, res) => {
  try {
    const { userId, refundAmount, message } = req.body;

    // Validate required fields
    if (!userId || !refundAmount) {
      return res.status(400).json({ error: 'User ID and refund amount are required' });
    }

    const refundTransaction = new Transaction({
      userId,
      amount: refundAmount,
      type: 'refund', // Set the transaction type to refund
      status: 'pending',
      message, // Optional field for any refund details
    });

    await refundTransaction.save();
    res.status(201).json({ message: 'Refund issued successfully', transaction: refundTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to issue refund' });
  }
};

module.exports = { transactionAdd, withdrawTransaction, betTransaction, refundTransaction };
