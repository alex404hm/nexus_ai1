require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');
const logger = require('./utils/logger');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Initialize Express app
const app = express();

// Handle unhandled Promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
});

// MongoDB connection with retry mechanism
const connectToMongoDB = async (retryCount = 0) => {
    const MAX_RETRIES = 5;
    try {
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB connected successfully.');
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            logger.error(`MongoDB connection error: ${error.message}. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => connectToMongoDB(retryCount + 1), 5000);
        } else {
            logger.error('Max retries reached. Could not connect to MongoDB.');
            process.exit(1);
        }
    }
};
connectToMongoDB();

// Security middlewares
app.use(
    helmet({
        contentSecurityPolicy: config.isProduction ? undefined : false,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);

// Essential middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// CORS configuration
app.use(
    cors({
        origin: config.FRONTEND_URL,
        credentials: true,
        allowedHeaders: ['X-CSRF-TOKEN', 'Content-Type', 'Authorization'],
    })
);

// Session management
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: config.isProduction,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Set CSRF token for frontend
app.use((req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken, { secure: config.isProduction, httpOnly: false });
    next();
});

// Serve static files (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, '../web')));

// Serve HTML files for dashboard and other routes
const serveHtmlPage = (fileName) => (req, res) => {
    res.sendFile(path.join(__dirname, '../web/html', fileName));
};

// Static HTML routes for all sidebar pages
app.get('/', serveHtmlPage('index.html'));
app.get('/auth/login', serveHtmlPage('login.html'));
app.get('/auth/signup', serveHtmlPage('signup.html'));
app.get('/auth/verify', serveHtmlPage('verify.html'));
app.get('/dashboard', serveHtmlPage('dashboard.html'));
app.get('/shop', serveHtmlPage('shop.html'));
app.get('/faq-support', serveHtmlPage('support.html'));
app.get('/forum', serveHtmlPage('forum.html'));
app.get('/free-tools', serveHtmlPage('free-tools.html'));
app.get('/claim', serveHtmlPage('claim.html'));
app.get('/settings', serveHtmlPage('settings.html'));

// API routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes); // Dashboard API route
app.use('/api/stats', statsRoutes); // Stats API route

// Error handling middleware
app.use(errorHandler);

// Start the server
const server = app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});

// Graceful shutdown function
const gracefulShutdown = async () => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed.');
        server.close(() => {
            logger.info('Server shut down gracefully.');
            process.exit(0);
        });
    } catch (err) {
        logger.error(`Error during shutdown: ${err.message}`);
        process.exit(1);
    }
};

// Listen for termination signals to gracefully shut down
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);