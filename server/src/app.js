/**
 * app.js — Express application configuration.
 * Registers all middleware, routes, and error handlers.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/index.js';
import {
    requestLogger,
    sanitize,
    generalLimiter,
    notFound,
    errorHandler,
} from './middleware/index.js';
import routes from './routes/index.js';

const app = express();

/* ── Security ── */
app.use(helmet());
app.use(cors(corsOptions));

/* ── Parsing ── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ── Middleware ── */
app.use(requestLogger);
app.use(sanitize);
app.use(generalLimiter);

/* ── Health Check ── */
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── API Routes ── */
app.use('/api', routes);

/* ── Error Handling ── */
app.use(notFound);
app.use(errorHandler);

export default app;
