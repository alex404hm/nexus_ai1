const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/config');

// Constants
const AUTH_COOKIE_NAME = 'authToken';
const LOGIN_REDIRECT_URL = '/auth/login';

// Helper function to retrieve token from cookies
const getTokenFromCookies = (req) => {
    return req.cookies?.[AUTH_COOKIE_NAME] || null;
};

// Helper function to verify JWT token
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return reject(new Error('Invalid token'));
            }
            resolve(decoded);
        });
    });
};

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    try {
        // Retrieve the token from cookies
        const token = getTokenFromCookies(req);

        if (!token) {
            console.log('No token found, redirecting to login.');
            return res.redirect(LOGIN_REDIRECT_URL);  // Redirect to login if no token is found
        }

        // Verify the JWT token and extract user details
        const decoded = await verifyToken(token);
        req.user = decoded;  // Attach decoded token info (user details) to request object

        next();  // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Error in authentication middleware:', error.message);
        // Clear the invalid token if needed and redirect to login page
        res.clearCookie(AUTH_COOKIE_NAME);
        return res.status(401).redirect(LOGIN_REDIRECT_URL);
    }
};