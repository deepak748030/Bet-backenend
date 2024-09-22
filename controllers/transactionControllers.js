const Transaction = require('../models/transcationModels');

// Add a new deposit transaction
const transactionAdd = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }

    const newTransaction = new Transaction({
      userId,
      amount,
      type: 'deposit', // Default to a deposit transaction type
      message,
    });

    // Save the transaction
    await newTransaction.save();
    res.status(201).json({ message: 'Deposit transaction created successfully', transaction: newTransaction });
  } catch (error) {
    console.error('Error creating deposit transaction:', error.message);
    res.status(500).json({ error: 'Failed to create deposit transaction', details: error.message });
  }
};

// Add a new withdraw transaction
const withdrawTransaction = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }

    const newWithdraw = new Transaction({
      userId,
      amount,
      type: 'withdraw', // Set transaction type to withdraw
      message,
    });

    // Save the transaction
    await newWithdraw.save();
    res.status(201).json({ message: 'Withdrawal transaction created successfully', transaction: newWithdraw });
  } catch (error) {
    console.error('Error creating withdraw transaction:', error.message);
    res.status(500).json({ error: 'Failed to create withdraw transaction', details: error.message });
  }
};

// Add a new bet transaction
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
      type: 'bet', // Set transaction type to bet
      message,
    });

    // Save the transaction
    await newBet.save();
    res.status(201).json({ message: 'Bet transaction created successfully', transaction: newBet });
  } catch (error) {
    console.error('Error creating bet transaction:', error.message);
    res.status(500).json({ error: 'Failed to create bet transaction', details: error.message });
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

    const refundTrans = new Transaction({
      userId,
      amount: refundAmount,
      type: 'refund', // Set transaction type to refund
      message,
    });

    // Save the transaction
    await refundTrans.save();
    res.status(201).json({ message: 'Refund transaction issued successfully', transaction: refundTrans });
  } catch (error) {
    console.error('Error creating refund transaction:', error.message);
    res.status(500).json({ error: 'Failed to issue refund transaction', details: error.message });
  }
};

// Get bets by User ID
const getBetByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all bets for the user
    const bets = await Transaction.find({ userId, type: 'bet' });

    // Count total bets and categorize by result
    const totalBets = bets.length;
    const wins = bets.filter(bet => bet.result === 'win').length;
    const losses = bets.filter(bet => bet.result === 'lost').length;
    const pending = bets.filter(bet => bet.result === 'pending').length;

    // Respond with total bets count and results
    return res.status(200).json({
      msg: 'Bets summary retrieved successfully.',
      totalBets,
      wins,
      losses,
      pending,
    });
  } catch (error) {
    console.error('Error fetching bets summary:', error.message);

    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        msg: 'Invalid user ID.',
      });
    }

    // Handle server error
    return res.status(500).json({
      msg: 'Error fetching bets summary.',
      error: error.message,
    });
  }
};

// Export the controller functions
module.exports = { transactionAdd, withdrawTransaction, betTransaction, refundTransaction, getBetByUserId };
