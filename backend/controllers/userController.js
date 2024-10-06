// Path: backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, message });
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return handleError(res, 404, 'User not found');
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        handleError(res, 500, 'Server error');
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    const { username, email, password, fullName } = req.body;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, 400, 'Invalid input');
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return handleError(res, 404, 'User not found');
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.fullName = fullName || user.fullName;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        handleError(res, 500, 'Server error');
    }
};