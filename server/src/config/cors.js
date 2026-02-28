/**
 * cors.js — CORS whitelist configuration.
 */
import env from './env.js';

const corsOptions = {
    origin: env.isDev
        ? function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            // Allow any localhost port in development
            if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        }
        : [env.CLIENT_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
