/**
 * message.routes.js — Messaging route definitions.
 */
import { Router } from 'express';
import { getConversations, getMessages, createConversation, sendMessage, markConversationRead } from '../controllers/message.controller.js';
import { authenticate } from '../middleware/index.js';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id', authenticate, getMessages);
router.post('/conversations', authenticate, createConversation);
router.post('/', authenticate, sendMessage);
router.patch('/conversations/:id/read', authenticate, markConversationRead);

export default router;
