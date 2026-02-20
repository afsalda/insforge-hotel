/**
 * listing.routes.js — Listing route definitions.
 */
import { Router } from 'express';
import {
    getListings,
    getFeaturedListings,
    getListingsByCategory,
    getListingById,
    checkAvailability,
    createListing,
    updateListing,
    deleteListing,
    getHostListings,
    toggleListingStatus,
    incrementViewCount,
} from '../controllers/listing.controller.js';
import { authenticate, authorize } from '../middleware/index.js';
import validate from '../middleware/validate.js';
import { createListingSchema, updateListingSchema } from '@staybnb/shared/schemas/listing.schema.js';

const router = Router();

// Public
router.get('/', getListings);
router.get('/featured', getFeaturedListings);
router.get('/categories/:slug', getListingsByCategory);
router.get('/:id', getListingById);
router.get('/:id/availability', checkAvailability);
router.post('/:id/view', incrementViewCount);

// Host protected
router.get('/host/my-listings', authenticate, authorize('host', 'admin'), getHostListings);
router.post('/', authenticate, authorize('host', 'admin'), validate(createListingSchema), createListing);
router.put('/:id', authenticate, authorize('host', 'admin'), validate(updateListingSchema), updateListing);
router.delete('/:id', authenticate, authorize('host', 'admin'), deleteListing);
router.patch('/:id/status', authenticate, authorize('host', 'admin'), toggleListingStatus);

export default router;
