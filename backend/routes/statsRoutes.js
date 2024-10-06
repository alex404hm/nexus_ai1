const express = require('express');
const router = express.Router();
const Stats = require('../models/statsModel'); // Ensure this path is correct
const User = require('../models/User');

// Endpoint to get stats
router.get('/api/stats', async (req, res) => {
    try {
        // Fetch the stats from the database
        const stats = await Stats.findOne();

        // Count total users in the database
        const totalUsers = await User.countDocuments();

        // If stats do not exist, create a new entry
        if (!stats) {
            const newStats = await Stats.create({ ordbogSearch: 0, chatbotMessages: 0 });
            return res.json({
                totalUsers,
                ordbogSearch: newStats.ordbogSearch,
                chatbotMessages: newStats.chatbotMessages,
            });
        }

        // Return the stats including total users
        res.json({
            totalUsers,
            ordbogSearch: stats.ordbogSearch,
            chatbotMessages: stats.chatbotMessages,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update the stats
router.post('/api/stats/update', async (req, res) => {
    const { ordbogSearch, chatbotMessages } = req.body;

    try {
        const stats = await Stats.findOneAndUpdate(
            {}, // Update the first document
            { ordbogSearch, chatbotMessages },
            { new: true, upsert: true } // Create a new document if none exists
        );

        res.json({ message: 'Stats updated successfully', stats });
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
