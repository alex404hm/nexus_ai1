const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const config = require('../config/config');

// Constants
const AUTH_COOKIE_NAME = 'authToken';
const EMAIL_COOKIE_NAME = 'userEmail';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
};

// Setup nodemailer for Gmail
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            username: user.username,
            email: user.email,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION || '1d' }
    );
};

// Helper function to send an email
const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Failed to send email:', error.message);
        throw new Error('Failed to send email');
    }
};

// Send verification email
const sendVerificationEmail = async (user) => {
    try {
        const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify/${user.verificationToken}`;
        const templatePath = path.join(__dirname, '../templates/verifyEmailTemplate.html');
        let emailTemplate = fs.readFileSync(templatePath, 'utf8');

        emailTemplate = emailTemplate.replace(/{{verifyUrl}}/g, verifyUrl).replace(/{{username}}/g, user.username);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verify Your Email',
            html: emailTemplate,
        };

        await sendEmail(mailOptions);
    } catch (error) {
        console.error('Failed to send verification email:', error.message);
        throw error;
    }
};

// Helper function for error handling
const handleError = (res, statusCode, message) => {
    console.error(message);
    return res.status(statusCode).json({ success: false, message });
};

// Helper function to set cookies
const setCookies = (res, token, email) => {
    res.cookie(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
    res.cookie(EMAIL_COOKIE_NAME, email, COOKIE_OPTIONS);
};

// Login Controller
exports.login = async (req, res) => {
    const { username_or_email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, 400, 'Invalid input');
    }

    try {
        const user = await User.findOne({
            $or: [{ username: username_or_email }, { email: username_or_email }],
        });

        if (!user) return handleError(res, 401, 'User not found.');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return handleError(res, 401, 'Incorrect password.');

        if (!user.verified) {
            if (!user.verificationToken) {
                user.verificationToken = crypto.randomBytes(20).toString('hex');
                await user.save();
            }
            return res.status(403).json({
                success: false,
                verified: false,
                message: 'Account not verified. Please check your email.',
                redirectUrl: '/auth/verify',
            });
        }

        const token = generateToken(user);
        setCookies(res, token, user.email);
        return res.status(200).json({
            success: true,
            token,
            userId: user._id,
            username: user.username,
            email: user.email,
            redirectUrl: '/dashboard',
        });
    } catch (error) {
        console.error('Login error:', error.message);
        return handleError(res, 500, 'Internal server error.');
    }
};

// Signup Controller
exports.signup = async (req, res) => {
    const { username, email, password, fullName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleError(res, 400, 'Invalid input');

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return handleError(res, 400, 'Username or email already exists.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            verified: false,
            verificationToken: crypto.randomBytes(20).toString('hex'),
        });

        await newUser.save();
        await sendVerificationEmail(newUser);

        res.status(201).json({
            success: true,
            message: 'Signup successful. Please check your email to verify your account.',
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        return handleError(res, 500, 'Internal server error.');
    }
};

// Verify Account Controller
exports.verifyAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) return handleError(res, 400, 'Invalid verification token.');

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.sendFile(path.join(__dirname, '../views/verifySuccess.html'));
    } catch (error) {
        console.error('Verification error:', error.message);
        return handleError(res, 500, 'Internal server error.');
    }
};

// Resend Verification Email Controller
exports.sendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleError(res, 400, 'Invalid input');

    try {
        const user = await User.findOne({ email });
        if (!user) return handleError(res, 400, 'No user found with that email address.');

        if (user.verified) return handleError(res, 400, 'Account is already verified.');

        if (!user.verificationToken) {
            user.verificationToken = crypto.randomBytes(20).toString('hex');
            await user.save();
        }

        await sendVerificationEmail(user);
        res.status(200).json({ success: true, message: 'Verification email sent successfully.' });
    } catch (error) {
        console.error('Resend verification email error:', error.message);
        return handleError(res, 500, 'Failed to send verification email.');
    }
};