/**
 * ApiError.js — Custom error class for consistent API error responses.
 * Extends Error with statusCode, code, and details for structured error handling.
 */
class ApiError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, details) {
        return new ApiError(message, 400, 'BAD_REQUEST', details);
    }

    static unauthorized(message = 'Unauthorized') {
        return new ApiError(message, 401, 'UNAUTHORIZED');
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(message, 403, 'FORBIDDEN');
    }

    static notFound(resource = 'Resource') {
        return new ApiError(`${resource} not found`, 404, 'NOT_FOUND');
    }

    static conflict(message) {
        return new ApiError(message, 409, 'CONFLICT');
    }

    static tooMany(message = 'Too many requests') {
        return new ApiError(message, 429, 'RATE_LIMIT');
    }

    static internal(message = 'Internal server error') {
        return new ApiError(message, 500, 'INTERNAL_ERROR');
    }
}

export default ApiError;
