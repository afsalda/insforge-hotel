/**
 * sanitize.js — Input sanitization middleware to prevent XSS.
 */
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: {},
};

function deepSanitize(obj) {
    if (typeof obj === 'string') {
        return sanitizeHtml(obj, sanitizeOptions);
    }
    if (Array.isArray(obj)) {
        return obj.map(deepSanitize);
    }
    if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = deepSanitize(value);
        }
        return sanitized;
    }
    return obj;
}

const sanitize = (req, res, next) => {
    if (req.body) req.body = deepSanitize(req.body);
    if (req.query) req.query = deepSanitize(req.query);
    if (req.params) req.params = deepSanitize(req.params);
    next();
};

export default sanitize;
