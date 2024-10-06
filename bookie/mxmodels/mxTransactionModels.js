const mongoose = require('mongoose');

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Properly defining ObjectId type
        ref: 'MxUser', // Reference to the User model
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['withdraw', 'bet', 'add', 'refund', 'deposit'], // Enum for different transaction types
        required: true, // Type is required
    },
    message: {
        type: String,
        default: null, // Optional field for additional information
    },
    result: {
        type: String,
        enum: ['win', 'lost', 'pending'], // Enum for result
        default: 'pending', // Default result status
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date on creation
    },
});

// Create the Transaction model
const Transaction = mongoose.model('MxTransaction', transactionSchema);

module.exports = Transaction;
