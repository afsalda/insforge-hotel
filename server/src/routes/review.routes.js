/**
 * review.routes.js — Review route definitions.
 */
import { Router } from 'express';
import {
    createReview, getListingReviews, getUserReviews,
    getReviewById, replyToReview, updateReview, deleteReview, flagReview,
} from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middleware/index.js';
import validate from '../middleware/validate.js';
import { createReviewSchema, replyReviewSchema } from '@staybnb/shared/schemas/review.schema.js';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), createReview);
router.get('/listing/:listingId', getListingReviews);
router.get('/user/:userId', getUserReviews);
router.get('/:id', getReviewById);
router.patch('/:id/reply', authenticate, authorize('host', 'admin'), validate(replyReviewSchema), replyToReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.post('/:id/flag', authenticate, flagReview);

export default router;
