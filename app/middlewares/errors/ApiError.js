class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational; // Indicates if the error is operational or not

        Error.captureStackTrace(this, this.constructor); // Captures the stack trace for debugging
    }
}

module.exports = ApiError; // Export the ApiError class for use in other parts of the application