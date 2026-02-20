/**
 * cors.js — CORS whitelist configuration.
 */
import env from './env.js';

const corsOptions = {
    origin: env.isDev
        ? [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000']
        : [env.CLIENT_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
