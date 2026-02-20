/**
 * sockets/index.js — Socket.io event handler initialization.
 * Authenticates connections and registers event handlers.
 */
import { verifyAccessToken } from '../utils/generateToken.js';
import logger from '../utils/logger.js';

const onlineUsers = new Map(); // userId → socketId

export function initSocketHandlers(io) {
    /* ── Auth Middleware ── */
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication required'));

        try {
            const decoded = verifyAccessToken(token);
            socket.userId = decoded.userId;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    /* ── Connection ── */
    io.on('connection', (socket) => {
        const { userId } = socket;
        onlineUsers.set(userId, socket.id);
        logger.debug(`Socket connected: ${userId}`);

        // Broadcast online status
        io.emit('user:online', { userId });

        /* ── Chat Events ── */
        socket.on('chat:join', (conversationId) => {
            socket.join(`chat:${conversationId}`);
        });

        socket.on('chat:leave', (conversationId) => {
            socket.leave(`chat:${conversationId}`);
        });

        socket.on('chat:typing', ({ conversationId, isTyping }) => {
            socket.to(`chat:${conversationId}`).emit('chat:typing', {
                userId,
                isTyping,
            });
        });

        socket.on('chat:message', (message) => {
            io.to(`chat:${message.conversationId}`).emit('chat:message', message);
        });

        /* ── Disconnect ── */
        socket.on('disconnect', () => {
            onlineUsers.delete(userId);
            io.emit('user:offline', { userId });
            logger.debug(`Socket disconnected: ${userId}`);
        });
    });
}

export function getOnlineUsers() {
    return onlineUsers;
}
