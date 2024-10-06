// middlewares/validationMiddleware.js
const { body } = require('express-validator');

exports.validateSignup = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.validateLogin = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').exists().withMessage('Password is required'),
];
