/**
 * validate.js — Zod schema validation middleware.
 * Validates req.body against a Zod schema. Returns 400 with details on failure.
 */
import ApiError from '../utils/ApiError.js';

const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return next(ApiError.badRequest('Validation failed', errors));
        }

        req.validatedBody = result.data;
        next();
    };
};

/** Validates query params instead of body */
export const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return next(ApiError.badRequest('Invalid query parameters', errors));
        }

        req.validatedQuery = result.data;
        next();
    };
};

export default validate;
