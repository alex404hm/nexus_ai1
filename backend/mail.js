require('dotenv').config();
const nodemailer = require('nodemailer');

// Create transporter using nodemailer and your credentials in .env file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send the email function
async function sendVerificationEmail(toEmail) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Verify your email address',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>Email Verification</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f7;
                        color: #333333;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #f4f4f7;
                    }
                    .email-box {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .header {
                        background-color: #4F46E5;
                        color: white;
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .content {
                        padding: 20px;
                        text-align: center;
                    }
                    .content p {
                        font-size: 18px;
                        color: #555555;
                    }
                    .verify-button {
                        background-color: #4F46E5;
                        color: white;
                        padding: 15px 25px;
                        border-radius: 50px;
                        text-decoration: none;
                        font-size: 16px;
                        margin: 20px 0;
                        display: inline-block;
                    }
                    .verify-button:hover {
                        background-color: #4338ca;
                    }
                    .footer {
                        background-color: #f4f4f7;
                        padding: 20px;
                        font-size: 14px;
                        color: #888888;
                        text-align: center;
                    }
                    .footer a {
                        color: #4F46E5;
                        text-decoration: none;
                    }
                    .footer a:hover {
                        text-decoration: underline;
                    }
                    .social-icons {
                        margin: 10px 0;
                    }
                    .social-icons img {
                        width: 30px;
                        margin: 0 10px;
                        opacity: 0.7;
                    }
                    .social-icons img:hover {
                        opacity: 1;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="email-box">
                        <!-- Header -->
                        <div class="header">
                            <h1>Verify Your Email</h1>
                        </div>

                        <!-- Email Content -->
                        <div class="content">
                            <p>Welcome to AI Nexus Pro! You're almost there.</p>
                            <p>Please verify your email address by clicking the button below.</p>
                            <a href="https://your-verification-link.com" class="verify-button">Verify Email</a>
                            <p>If you didn’t sign up, you can safely ignore this email.</p>
                        </div>

                        <!-- Footer -->
                        <div class="footer">
                            <p>Need help? <a href="https://support.yourwebsite.com">Contact Support</a></p>
                            <div class="social-icons">
                                <a href="https://twitter.com/yourcompany"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter"></a>
                                <a href="https://facebook.com/yourcompany"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook"></a>
                                <a href="https://linkedin.com/yourcompany"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn"></a>
                            </div>
                            <p>&copy; 2024 AI Nexus Pro. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
        });

        console.log(`Verification email sent: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
}

// Example usage: Send email to a specific user
sendVerificationEmail('alexander.hm404@gmail.com');
