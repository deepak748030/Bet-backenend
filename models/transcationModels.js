const mongoose = require('mongoose');

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is an ObjectId from the User model
    ref: 'User', // Reference to the User model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['withdraw', 'bet', 'add', 'refund'], // Enum for different transaction types
    required: true, // Type is required
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'], // Enum for status
    default: 'pending', // Default status is pending
  },
  message: {
    type: String,
    required: false, // Optional field for additional information
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date on creation
  },
});

// Create the model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
