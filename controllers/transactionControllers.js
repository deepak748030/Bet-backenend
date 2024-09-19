const Transaction = require('../models/transcationModels');

// Add a new transaction
const transactionAdd = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;

    // Ensure necessary fields are provided
    if (!userId || !amount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newTransaction = new Transaction({
      userId,
      amount,
      message,
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

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
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
    const { userId, amount, message } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newBet = new Transaction({
      userId,
      amount,
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
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const refundTransaction = new Transaction({
      userId,
      amount: refundAmount,
      message, // Optional field for any refund message
    });

    await refundTransaction.save();
    res.status(201).json({ message: 'Refund issued successfully', transaction: refundTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to issue refund' });
  }
};

module.exports = { transactionAdd, transactionUpdate, betTransaction, refundTransaction };
