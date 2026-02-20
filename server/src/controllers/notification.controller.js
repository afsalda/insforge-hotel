/**
 * notification.controller.js — Notification management handlers.
 */
import { insforge } from '../config/index.js';
import { ApiResponse, asyncHandler } from '../utils/index.js';
import { getPaginationRange, buildPaginationMeta } from '../utils/pagination.js';

export const getNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    const { data, count } = await insforge.database
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

    ApiResponse.ok({
        notifications: data || [],
        pagination: buildPaginationMeta(Number(page), Number(limit), count || 0),
    }).send(res);
});

export const getUnreadCount = asyncHandler(async (req, res) => {
    const { count } = await insforge.database
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', req.user.id)
        .eq('is_read', false);

    ApiResponse.ok({ unreadCount: count || 0 }).send(res);
});

export const markAsRead = asyncHandler(async (req, res) => {
    await insforge.database
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

    ApiResponse.ok(null, 'Marked as read').send(res);
});

export const markAllRead = asyncHandler(async (req, res) => {
    await insforge.database
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', req.user.id)
        .eq('is_read', false);

    ApiResponse.ok(null, 'All marked as read').send(res);
});

export const deleteNotification = asyncHandler(async (req, res) => {
    await insforge.database
        .from('notifications')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

    ApiResponse.ok(null, 'Notification deleted').send(res);
});
