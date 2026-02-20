/**
 * notFound.js — 404 handler for unmatched routes.
 */
import ApiError from '../utils/ApiError.js';

const notFound = (req, res, next) => {
    next(ApiError.notFound(`Route ${req.originalUrl}`));
};

export default notFound;
