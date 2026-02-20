/**
 * socket.js — Socket.io server configuration.
 */
import { Server } from 'socket.io';
import env from './env.js';

let io = null;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: env.isDev
                ? [env.CLIENT_URL, 'http://localhost:5173']
                : [env.CLIENT_URL],
            credentials: true,
        },
    });

    return io;
}

export function getIO() {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
}
