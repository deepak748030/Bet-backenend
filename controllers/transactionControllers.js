const Transaction = require('../models/transcationModels');

// Add a new deposit transaction
const transactionAdd = async (req, res) => {
  try {
    const { userId, amount, message } = req.body;
    console.log(userId, amount, message)

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
    console.log(newTransaction)
    // Save the transaction
    await newTransaction.save();
    res.status(201).json({ message: 'Deposit transaction created successfully', transaction: newTransaction });
  } catch (error) {
    console.error('Error creating deposit transaction:', error.message);
    res.status(500).json({ error: 'Failed to create deposit transaction' });
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
      status: 'pending',
      message,
    });

    // Save the transaction
    await newWithdraw.save();
    res.status(201).json({ message: 'Withdrawal transaction created successfully', transaction: newWithdraw });
  } catch (error) {
    console.error('Error creating withdraw transaction:', error.message);
    res.status(500).json({ error: 'Failed to create withdraw transaction' });
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
      status: 'pending',
      message,
    });

    // Save the transaction
    await newBet.save();
    res.status(201).json({ message: 'Bet transaction created successfully', transaction: newBet });
  } catch (error) {
    console.error('Error creating bet transaction:', error.message);
    res.status(500).json({ error: 'Failed to create bet transaction' });
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
      status: 'pending',
      message,
    });

    // Save the transaction
    await refundTrans.save();
    res.status(201).json({ message: 'Refund transaction issued successfully', transaction: refundTrans });
  } catch (error) {
    console.error('Error creating refund transaction:', error.message);
    res.status(500).json({ error: 'Failed to issue refund transaction' });
  }
};


// Get bets by User ID
const getBetByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all bets for the user
    const bets = await Transaction.find({ userId, type: 'bet' });

    // Count total bets
    const totalBets = bets.length;

    // Respond with total bets count and all bets data
    return res.status(200).json({
      msg: 'Bets retrieved successfully.',
      totalBets,
      bets, // Include all bets data
    });
  } catch (error) {
    console.error('Error fetching bets:', error.message);

    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        msg: 'Invalid user ID.',
      });
    }

    // Handle server error
    return res.status(500).json({
      msg: 'Error fetching bets.',
      error: error.message,
    });
  }
};

// Export the controller functions
module.exports = { transactionAdd, withdrawTransaction, betTransaction, refundTransaction, getBetByUserId };
