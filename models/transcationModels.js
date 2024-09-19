const mongoose = require('mongoose');

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['withdraw', 'refund'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  message: {
    type: String,
    required: false,
  },
  refundDate: {
    type: Date,
    required: function () {
      return this.type === 'refund';
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;