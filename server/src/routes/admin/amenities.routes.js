import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../../config/index.js';
import { ApiResponse, asyncHandler } from '../../utils/index.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('amenities').select('*').order('name', { ascending: true });
    ApiResponse.ok(data || []).send(res);
}));

router.post('/', asyncHandler(async (req, res) => {
    const { name, icon, category } = req.body;
    const { data } = await insforge.database.from('amenities').insert({
        id: uuidv4(), name, icon: icon || null, category: category || 'general',
        created_at: new Date().toISOString(),
    }).select().single();
    ApiResponse.created(data).send(res);
}));

router.put('/:id', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('amenities').update(req.body).eq('id', req.params.id).select().single();
    ApiResponse.ok(data, 'Amenity updated').send(res);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    await insforge.database.from('amenities').delete().eq('id', req.params.id);
    ApiResponse.ok(null, 'Amenity deleted').send(res);
}));

export default router;
