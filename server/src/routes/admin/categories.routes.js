import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../../config/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../../utils/index.js';
import { generateSlug } from '@staybnb/shared/utils/slugify.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    const { data } = await insforge.database.from('categories').select('*').order('name', { ascending: true });
    ApiResponse.ok(data || []).send(res);
}));

router.post('/', asyncHandler(async (req, res) => {
    const { name, description, icon } = req.body;
    const { data } = await insforge.database.from('categories').insert({
        id: uuidv4(), name, slug: generateSlug(name), description, icon: icon || null,
        created_at: new Date().toISOString(),
    }).select().single();
    ApiResponse.created(data).send(res);
}));

router.put('/:id', asyncHandler(async (req, res) => {
    const { name, description, icon } = req.body;
    const updates = {};
    if (name) { updates.name = name; updates.slug = generateSlug(name); }
    if (description !== undefined) updates.description = description;
    if (icon !== undefined) updates.icon = icon;
    const { data } = await insforge.database.from('categories').update(updates).eq('id', req.params.id).select().single();
    ApiResponse.ok(data, 'Category updated').send(res);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    await insforge.database.from('categories').delete().eq('id', req.params.id);
    ApiResponse.ok(null, 'Category deleted').send(res);
}));

export default router;
