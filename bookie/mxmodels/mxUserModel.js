// models/fxUserModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Basic email validation
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid mobile number'], // 10-digit mobile validation
    },
    isBlocked: {
        type: Boolean,
        default: false,  // User is not blocked by default
    },
    registerDate: {
        type: Date,
        default: Date.now, // Automatically sets the registration date to the current date
    },
    lastActiveDate: {
        type: Date,
        default: null, // Optional, will be updated based on user activity
    },
    winningWallet: {
        type: Number,
        default: 0,  // Winning wallet balance starts at 0 by default
    },
    depositWallet: {
        type: Number,
        default: 0,  // Deposit wallet balance starts at 0 by default
    },
    bonusWallet: {
        type: Number,
        default: 0,  // Bonus wallet balance starts at 0 by default
    },
});

const fxUserModel = mongoose.model('MxUsers', userSchema);  // Changed the model name to fxUserModel
module.exports = fxUserModel;
