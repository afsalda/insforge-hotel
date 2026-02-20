/**
 * server.js — Application entry point.
 * Creates HTTP server, initializes Socket.io, and starts listening.
 */
import http from 'http';
import app from './app.js';
import { env, initSocket } from './config/index.js';
import { initSocketHandlers } from './sockets/index.js';
import logger from './utils/logger.js';

const server = http.createServer(app);

/* ── Socket.io ── */
const io = initSocket(server);
initSocketHandlers(io);

/* ── Start ── */
server.listen(env.PORT, () => {
    logger.success(`🚀 Server running on port ${env.PORT}`);
    logger.info(`   Environment: ${env.NODE_ENV}`);
    logger.info(`   Client URL:  ${env.CLIENT_URL}`);
    logger.info(`   InsForge:    ${env.INSFORGE_URL}`);
});

/* ── Graceful Shutdown ── */
process.on('SIGTERM', () => {
    logger.warn('SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
});

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', { message: err.message, stack: err.stack });
});
