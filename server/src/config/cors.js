/**
 * cors.js — CORS whitelist configuration.
 */
import env from './env.js';

const corsOptions = {
    origin: env.isDev
        ? [
            env.CLIENT_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'http://localhost:5177',
            'http://localhost:5178',
            'http://localhost:3000',
        ]
        : [env.CLIENT_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
