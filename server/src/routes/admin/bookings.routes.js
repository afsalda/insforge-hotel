import { Router } from 'express';
import { insforge } from '../../config/index.js';
import { ApiResponse, asyncHandler } from '../../utils/index.js';
import { getPaginationRange, buildPaginationMeta } from '../../utils/pagination.js';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));
    let query = insforge.database.from('bookings').select('*', { count: 'exact' });
    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(from, to);
    const { data, count } = await query;
    ApiResponse.ok({ bookings: data || [], pagination: buildPaginationMeta(Number(page), Number(limit), count || 0) }).send(res);
}));

export default router;
