const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const config = require('../config/config');

exports.sendVerificationEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });

    const verificationLink = `http://localhost:${config.PORT}/auth/verify-email?token=${user.verificationCode}`;
    const mailOptions = {
        from: config.EMAIL_USER,
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info('Verification email sent to', user.email);
    } catch (error) {
        logger.error('Error sending verification email:', error.message);
    }
};