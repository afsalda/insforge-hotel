/**
 * logger.js — Simple structured logger for development and production.
 * Uses console with formatting; replace with Winston/Pino for production.
 */
import env from '../config/env.js';

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
};

const logger = {
    info(message, meta = {}) {
        const ts = new Date().toISOString();
        console.log(`${colors.blue}[INFO]${colors.reset} ${colors.gray}${ts}${colors.reset} ${message}`, Object.keys(meta).length ? meta : '');
    },

    warn(message, meta = {}) {
        const ts = new Date().toISOString();
        console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.gray}${ts}${colors.reset} ${message}`, Object.keys(meta).length ? meta : '');
    },

    error(message, meta = {}) {
        const ts = new Date().toISOString();
        console.error(`${colors.red}[ERROR]${colors.reset} ${colors.gray}${ts}${colors.reset} ${message}`, Object.keys(meta).length ? meta : '');
    },

    debug(message, meta = {}) {
        if (env.isDev) {
            const ts = new Date().toISOString();
            console.log(`${colors.gray}[DEBUG] ${ts} ${message}${colors.reset}`, Object.keys(meta).length ? meta : '');
        }
    },

    success(message) {
        const ts = new Date().toISOString();
        console.log(`${colors.green}[OK]${colors.reset} ${colors.gray}${ts}${colors.reset} ${message}`);
    },
};

export default logger;
