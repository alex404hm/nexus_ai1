require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION || '1d',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    FRONTEND_URL: process.env.FRONTEND_URL,
};