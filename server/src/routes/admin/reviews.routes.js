import { Router } from 'express';
import { insforge } from '../../config/index.js';
import { ApiResponse, asyncHandler } from '../../utils/index.js';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('reviews').select('*').order('created_at', { ascending: false }).limit(50);
    ApiResponse.ok(data || []).send(res);
}));

router.get('/flagged', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('reviews').select('*').eq('is_flagged', true).order('created_at', { ascending: false });
    ApiResponse.ok(data || []).send(res);
}));

router.patch('/:id/approve', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('reviews').update({ is_approved: true, is_flagged: false }).eq('id', req.params.id).select().single();
    ApiResponse.ok(data, 'Review approved').send(res);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    await insforge.database.from('reviews').delete().eq('id', req.params.id);
    ApiResponse.ok(null, 'Review deleted').send(res);
}));

export default router;
