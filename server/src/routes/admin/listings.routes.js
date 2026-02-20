/**
 * admin/listings.routes.js — Admin listing management.
 */
import { Router } from 'express';
import { insforge } from '../../config/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../../utils/index.js';
import { getPaginationRange, buildPaginationMeta } from '../../utils/pagination.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    const { status, search, page = 1, limit = 20 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    let query = insforge.database.from('listings').select('*', { count: 'exact' });
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count } = await query;
    ApiResponse.ok({ listings: data || [], pagination: buildPaginationMeta(Number(page), Number(limit), count || 0) }).send(res);
}));

router.patch('/:id/approve', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('listings').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
    if (!data) throw ApiError.notFound('Listing');
    ApiResponse.ok(data, 'Listing approved').send(res);
}));

router.patch('/:id/reject', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('listings').update({ status: 'rejected', rejection_reason: req.body.reason, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
    ApiResponse.ok(data, 'Listing rejected').send(res);
}));

router.patch('/:id/feature', asyncHandler(async (req, res) => {
    const { data: listing } = await insforge.database.from('listings').select('is_featured').eq('id', req.params.id).single();
    const { data } = await insforge.database.from('listings').update({ is_featured: !listing.is_featured }).eq('id', req.params.id).select().single();
    ApiResponse.ok(data).send(res);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    await insforge.database.from('listings').delete().eq('id', req.params.id);
    ApiResponse.ok(null, 'Listing deleted').send(res);
}));

export default router;
