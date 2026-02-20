/**
 * wishlist.routes.js — Wishlist route definitions.
 */
import { Router } from 'express';
import { getWishlists, createWishlist, updateWishlist, deleteWishlist, addToWishlist, removeFromWishlist, checkWishlisted } from '../controllers/wishlist.controller.js';
import { authenticate } from '../middleware/index.js';

const router = Router();

router.get('/', authenticate, getWishlists);
router.post('/', authenticate, createWishlist);
router.put('/:id', authenticate, updateWishlist);
router.delete('/:id', authenticate, deleteWishlist);
router.post('/:id/listings/:listingId', authenticate, addToWishlist);
router.delete('/:id/listings/:listingId', authenticate, removeFromWishlist);
router.get('/check/:listingId', authenticate, checkWishlisted);

export default router;
