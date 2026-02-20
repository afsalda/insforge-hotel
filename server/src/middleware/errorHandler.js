/**
 * errorHandler.js — Global Express error handler.
 * Catches all errors and returns a standardized JSON response.
 * Never exposes stack traces in production.
 */
import { env } from '../config/index.js';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, _next) => {
    logger.error(err.message, {
        stack: env.isDev ? err.stack : undefined,
        path: req.originalUrl,
        method: req.method,
    });

    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: statusCode === 500 && env.isProd
            ? 'Internal server error'
            : err.message,
        code: err.code || 'INTERNAL_ERROR',
    };

    if (err.details) {
        response.errors = err.details;
    }

    if (env.isDev) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
