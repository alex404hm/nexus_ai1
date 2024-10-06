const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
    '/login',
    [
        body('username_or_email').notEmpty().withMessage('Username or email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    authController.login
);

router.post(
    '/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    authController.signup
);

router.get('/verify/:token', authController.verifyAccount);

router.post(
    '/resend-verification-email',
    [body('email').isEmail().withMessage('Valid email is required')],
    authController.sendVerificationEmail
);

module.exports = router;