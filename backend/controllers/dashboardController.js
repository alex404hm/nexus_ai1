// Path: backend/controllers/dashboardController.js

const User = require('../models/User');
const Project = require('../models/projectModel');
const AIModel = require('../models/aiModel');

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, message });
};

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const projectCount = await Project.countDocuments();
        const aiModelCount = await AIModel.countDocuments();

        res.json({
            success: true,
            data: {
                userCount,
                projectCount,
                aiModelCount,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        handleError(res, 500, 'Server error');
    }
};