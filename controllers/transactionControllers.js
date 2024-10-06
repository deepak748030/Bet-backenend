const Transaction = require('../models/transcationModels');
const User = require('../models/userModels');

// Add a new deposit transaction
const transactionAdd = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }

    // Find the user and update their deposit wallet
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's deposit wallet
    user.depositWallet += amount;
    await user.save();

    // Create the deposit transaction
    const newTransaction = new Transaction({
      userId,
      amount,
      type: 'deposit',
      message,
    });

    // Save the transaction
    await newTransaction.save();
    res.status(201).json({ message: 'Deposit transaction created successfully', transaction: newTransaction, wallet: user.depositWallet });
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

    // Find the user and check their deposit wallet balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.depositWallet < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Deduct from the user's deposit wallet
    user.depositWallet -= amount;
    await user.save();

    // Create the withdrawal transaction
    const newWithdraw = new Transaction({
      userId,
      amount,
      type: 'withdraw',
      message,
    });

    // Save the transaction
    await newWithdraw.save();
    res.status(201).json({ message: 'Withdrawal transaction created successfully', transaction: newWithdraw, wallet: user.depositWallet });
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

    // Find the user and check their deposit wallet balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.depositWallet < amount) {
      return res.status(400).json({ error: 'Low balance' });
    }

    // Deduct from the user's deposit wallet
    user.depositWallet -= amount;
    await user.save();

    // Create the bet transaction
    const newBet = new Transaction({
      userId,
      amount,
      type: 'bet',
      message,
      result: 'pending', // Result can be updated later (win/lost)
    });

    // Save the transaction
    await newBet.save();
    res.status(201).json({ message: 'Bet transaction created successfully', transaction: newBet, wallet: user.depositWallet });
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

    // Find the user and update their winning wallet
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add refund amount to the winning wallet
    user.winningWallet += refundAmount;
    await user.save();

    // Create the refund transaction
    const refundTrans = new Transaction({
      userId,
      amount: refundAmount,
      type: 'refund',
      message,
    });

    // Save the transaction
    await refundTrans.save();
    res.status(201).json({ message: 'Refund transaction issued successfully', transaction: refundTrans, wallet: user.winningWallet });
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

    return res.status(500).json({
      msg: 'Error fetching bets summary.',
      error: error.message,
    });
  }
};

// Controller function to handle getting recent transactions by userId and count
const getRecentTrxByUserId = async (req, res) => {
  const { userId, count } = req.params;

  try {
    // Fetch recent transactions for the user, sorted by latest, limited by the count
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })  // Assuming 'createdAt' is the field storing the timestamp of the transaction
      .limit(Number(count));

    // If no transactions found, return a 404
    if (!transactions.length) {
      return res.status(404).json({ message: 'No transactions found for this user.' });
    }

    // Send the transactions back in the response
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the controller functions
module.exports = {
  transactionAdd,
  withdrawTransaction,
  betTransaction,
  refundTransaction,
  getBetByUserId,
  getRecentTrxByUserId
};
