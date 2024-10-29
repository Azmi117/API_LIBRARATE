// middlewares/errorMiddleware.js
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Log the error if needed (console, or a log management service)
    console.error(`[${new Date().toISOString()}] ${statusCode}: ${message}`);

    res.status(statusCode).json({ status: 'error', statusCode, message });
};

module.exports = { errorMiddleware, ApiError };
