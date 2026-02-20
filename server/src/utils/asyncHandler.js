/**
 * asyncHandler.js — Wraps async route handlers to catch errors automatically.
 * Eliminates the need for try/catch blocks in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
