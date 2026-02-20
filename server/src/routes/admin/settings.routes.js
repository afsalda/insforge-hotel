import { Router } from 'express';
import { insforge } from '../../config/index.js';
import { ApiResponse, asyncHandler } from '../../utils/index.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('settings').select('*').single();
    ApiResponse.ok(data || {}).send(res);
}));

router.put('/', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('settings').update(req.body).eq('id', req.body.id).select().single();
    ApiResponse.ok(data, 'Settings updated').send(res);
}));

export default router;
