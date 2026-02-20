/**
 * requestLogger.js — HTTP request logger using Morgan.
 */
import morgan from 'morgan';
import { env } from '../config/index.js';

const requestLogger = morgan(
    env.isDev ? 'dev' : 'combined',
    { skip: (req) => req.url === '/health' }
);

export default requestLogger;
