// controllers/userController.js
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    const { name, mobile, email } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with email or mobile number already exists' });
        }

        // Create new user
        const newUser = new User({ name, mobile, email });
        await newUser.save();

        // Generate JWT (replace 'secretkey' with your actual secret key)
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secretkey', {
            expiresIn: '1d', // Token expiration time
        });

        // Respond with user data and token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
                isBlocked: newUser.isBlocked,
                registerDate: newUser.registerDate,
                winningWallet: newUser.winningWallet,
                depositWallet: newUser.depositWallet,
                bonusWallet: newUser.bonusWallet,

            },
            token, // JWT token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login user with mobile number
const loginUser = async (req, res) => {
    const { mobile } = req.body;

    try {
        // Check if user exists by mobile number
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: 'User not registered' });
        }

        // Generate JWT token (replace 'secretkey' with your actual secret key)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', {
            expiresIn: '1d', // Token expiration time
        });

        // Respond with user data and token
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isBlocked: user.isBlocked,
                registerDate: user.registerDate,
                winningWallet: newUser.winningWallet,
                depositWallet: newUser.depositWallet,
                bonusWallet: newUser.bonusWallet,
            },
            token, // JWT token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get user by userId
const getUserById = async (req, res) => {
    const { id } = req.params;  // Extract the userId from request parameters

    try {
        // Find the user by id
        const user = await User.findById(id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user data
        res.status(200).json({
            message: 'User retrieved successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isBlocked: user.isBlocked,
                registerDate: user.registerDate,
                lastActiveDate: user.lastActiveDate,
                winningWallet: newUser.winningWallet,
                depositWallet: newUser.depositWallet,
                bonusWallet: newUser.bonusWallet,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { registerUser, loginUser, getUserById };
