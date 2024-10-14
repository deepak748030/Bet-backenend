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
                winningWallet: user.winningWallet,
                depositWallet: user.depositWallet,
                bonusWallet: user.bonusWallet,
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
                winningWallet: user.winningWallet,
                depositWallet: user.depositWallet,
                bonusWallet: user.bonusWallet,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users (without filtering by _id)
        const users = await User.find({}); // Empty object means no filter, fetch all users

        // If no users found
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Respond with the user data
        res.status(200).json({
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error });
    }
};


// Block or Unblock a user
const toggleBlockUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the isBlocked field
        user.isBlocked = !user.isBlocked;
        await user.save();

        // Return the updated user status
        res.status(200).json({
            message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user
        });
    } catch (error) {
        console.error('Error toggling block user:', error);
        res.status(500).json({ message: 'Server error. Could not block/unblock user.' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find and delete the user
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error. Could not delete user.' });
    }
};


module.exports = { registerUser, loginUser, getUserById, getAllUsers, deleteUser, toggleBlockUser };
