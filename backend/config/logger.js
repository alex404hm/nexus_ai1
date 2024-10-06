const { createLogger, format, transports } = require('winston');

// Create a logger with different transports (console and file)
const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' })
    ]
});

module.exports = logger;
