/**
 * message.schema.js — Zod validation schemas for messaging.
 */
import { z } from 'zod';

export const sendMessageSchema = z.object({
    conversationId: z.string().uuid().optional(),
    recipientId: z.string().uuid().optional(),
    listingId: z.string().uuid().optional(),
    text: z.string().min(1, 'Message cannot be empty').max(2000),
});

export const createConversationSchema = z.object({
    recipientId: z.string().uuid('Invalid recipient'),
    listingId: z.string().uuid().optional(),
    text: z.string().min(1).max(2000),
});
