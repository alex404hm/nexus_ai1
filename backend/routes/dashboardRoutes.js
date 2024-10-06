const express = require('express');
const path = require('path');
const { isAuthenticated } = require('../middlewares/authMiddleware'); // Only authentication middleware

const router = express.Router();

// Serve dashboard.html for the /dashboard route (only authentication required)
router.get('/dashboard', isAuthenticated, (req, res, next) => {
    // Path to dashboard.html
    const filePath = path.join(__dirname, '../../web/html/dashboard.html'); 

    // Log the path for debugging
    console.log('Serving dashboard from path:', filePath);

    // Serve the dashboard file
    res.status(200).sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving dashboard file:', err.message);
            return next(err); // Pass the error to Express error handling middleware
        } else {
            console.log(`Dashboard served to user ${req.user ? req.user.username : 'Unknown User'}`);
        }
    });
});

module.exports = router;
