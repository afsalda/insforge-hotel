/**
 * wishlist.controller.js — Wishlist management handlers.
 */
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../config/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

export const getWishlists = asyncHandler(async (req, res) => {
    const { data } = await insforge.database
        .from('wishlists')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

    ApiResponse.ok(data || []).send(res);
});

export const createWishlist = asyncHandler(async (req, res) => {
    const { name, privacy } = req.body;

    const { data } = await insforge.database
        .from('wishlists')
        .insert({
            id: uuidv4(),
            user_id: req.user.id,
            name: name || 'My Wishlist',
            privacy: privacy || 'private',
            listing_ids: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    ApiResponse.created(data).send(res);
});

export const updateWishlist = asyncHandler(async (req, res) => {
    const { data: wishlist } = await insforge.database
        .from('wishlists')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .single();

    if (!wishlist) throw ApiError.notFound('Wishlist');

    const { data } = await insforge.database
        .from('wishlists')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data).send(res);
});

export const deleteWishlist = asyncHandler(async (req, res) => {
    await insforge.database
        .from('wishlists')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

    ApiResponse.ok(null, 'Wishlist deleted').send(res);
});

export const addToWishlist = asyncHandler(async (req, res) => {
    const { data: wishlist } = await insforge.database
        .from('wishlists')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .single();

    if (!wishlist) throw ApiError.notFound('Wishlist');

    const listingIds = wishlist.listing_ids || [];
    if (!listingIds.includes(req.params.listingId)) {
        listingIds.push(req.params.listingId);
    }

    const { data } = await insforge.database
        .from('wishlists')
        .update({ listing_ids: listingIds, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, 'Added to wishlist').send(res);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { data: wishlist } = await insforge.database
        .from('wishlists')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .single();

    if (!wishlist) throw ApiError.notFound('Wishlist');

    const listingIds = (wishlist.listing_ids || []).filter(
        (id) => id !== req.params.listingId
    );

    const { data } = await insforge.database
        .from('wishlists')
        .update({ listing_ids: listingIds, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, 'Removed from wishlist').send(res);
});

export const checkWishlisted = asyncHandler(async (req, res) => {
    const { data: wishlists } = await insforge.database
        .from('wishlists')
        .select('id, listing_ids')
        .eq('user_id', req.user.id);

    const isWishlisted = wishlists?.some((w) =>
        (w.listing_ids || []).includes(req.params.listingId)
    );

    ApiResponse.ok({ isWishlisted: !!isWishlisted }).send(res);
});
