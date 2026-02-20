/**
 * notification.routes.js — Notification route definitions.
 */
import { Router } from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllRead, deleteNotification } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/index.js';

const router = Router();

router.get('/', authenticate, getNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllRead);
router.delete('/:id', authenticate, deleteNotification);

export default router;
