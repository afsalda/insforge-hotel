/**
 * review.schema.js — Zod validation schemas for reviews.
 */
import { z } from 'zod';

const ratingField = z.number().int().min(1).max(5);

export const createReviewSchema = z.object({
    bookingId: z.string().uuid('Invalid booking'),
    overallRating: ratingField,
    categories: z.object({
        cleanliness: ratingField,
        accuracy: ratingField,
        checkIn: ratingField,
        communication: ratingField,
        location: ratingField,
        value: ratingField,
    }),
    comment: z.string().min(10, 'Review must be at least 10 characters').max(2000),
});

export const replyReviewSchema = z.object({
    comment: z.string().min(1, 'Reply cannot be empty').max(1000),
});
