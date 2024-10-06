const { check } = require('express-validator');

// Validation for the signup process
exports.signupValidation = [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];

// Validation for the login process
exports.loginValidation = [
    check('username_or_email', 'Username or email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
];
