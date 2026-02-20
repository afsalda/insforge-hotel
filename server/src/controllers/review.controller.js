/**
 * review.controller.js — Review CRUD and moderation handlers.
 */
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../config/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';
import { getPaginationRange, buildPaginationMeta } from '../utils/pagination.js';

export const createReview = asyncHandler(async (req, res) => {
    const { bookingId, overallRating, categories, comment } = req.validatedBody;

    // Verify booking exists, belongs to reviewer, and is completed
    const { data: booking } = await insforge.database
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('guest_id', req.user.id)
        .single();

    if (!booking) throw ApiError.notFound('Booking');
    if (booking.status !== 'completed') {
        throw ApiError.badRequest('Can only review completed bookings');
    }

    // Rule #14: Check checkout date has passed
    if (new Date(booking.check_out) > new Date()) {
        throw ApiError.badRequest('Can only review after checkout');
    }

    // One review per booking
    const { data: existing } = await insforge.database
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .maybeSingle();

    if (existing) throw ApiError.conflict('You already reviewed this booking');

    const review = {
        id: uuidv4(),
        booking_id: bookingId,
        listing_id: booking.listing_id,
        reviewer_id: req.user.id,
        host_id: booking.host_id,
        overall_rating: overallRating,
        cat_cleanliness: categories.cleanliness,
        cat_accuracy: categories.accuracy,
        cat_check_in: categories.checkIn,
        cat_communication: categories.communication,
        cat_location: categories.location,
        cat_value: categories.value,
        comment,
        is_approved: true,
        is_flagged: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await insforge.database
        .from('reviews')
        .insert(review)
        .select()
        .single();

    if (error) throw ApiError.internal('Failed to create review');

    // Update listing average rating
    const { data: reviews } = await insforge.database
        .from('reviews')
        .select('overall_rating')
        .eq('listing_id', booking.listing_id)
        .eq('is_approved', true);

    if (reviews?.length) {
        const avg = reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length;
        await insforge.database
            .from('listings')
            .update({ avg_rating: Math.round(avg * 10) / 10, total_reviews: reviews.length })
            .eq('id', booking.listing_id);
    }

    ApiResponse.created(data, 'Review submitted').send(res);
});

export const getListingReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    const { data: reviews, count } = await insforge.database
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('listing_id', req.params.listingId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .range(from, to);

    ApiResponse.ok({
        reviews: reviews || [],
        pagination: buildPaginationMeta(Number(page), Number(limit), count || 0),
    }).send(res);
});

export const getUserReviews = asyncHandler(async (req, res) => {
    const { data: reviews } = await insforge.database
        .from('reviews')
        .select('*')
        .eq('reviewer_id', req.params.userId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    ApiResponse.ok(reviews || []).send(res);
});

export const getReviewById = asyncHandler(async (req, res) => {
    const { data: review } = await insforge.database
        .from('reviews')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (!review) throw ApiError.notFound('Review');
    ApiResponse.ok(review).send(res);
});

export const replyToReview = asyncHandler(async (req, res) => {
    const { data: review } = await insforge.database
        .from('reviews')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (!review) throw ApiError.notFound('Review');
    if (review.host_id !== req.user.id) throw ApiError.forbidden();

    const { data } = await insforge.database
        .from('reviews')
        .update({
            host_reply_comment: req.validatedBody.comment,
            host_reply_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, 'Reply added').send(res);
});

export const updateReview = asyncHandler(async (req, res) => {
    const { data: review } = await insforge.database
        .from('reviews')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (!review) throw ApiError.notFound('Review');
    if (review.reviewer_id !== req.user.id) throw ApiError.forbidden();

    const { data } = await insforge.database
        .from('reviews')
        .update({ comment: req.body.comment, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, 'Review updated').send(res);
});

export const deleteReview = asyncHandler(async (req, res) => {
    const { data: review } = await insforge.database
        .from('reviews')
        .select('id, reviewer_id')
        .eq('id', req.params.id)
        .single();

    if (!review) throw ApiError.notFound('Review');
    if (review.reviewer_id !== req.user.id && req.user.role !== 'admin') {
        throw ApiError.forbidden();
    }

    await insforge.database.from('reviews').delete().eq('id', req.params.id);
    ApiResponse.ok(null, 'Review deleted').send(res);
});

export const flagReview = asyncHandler(async (req, res) => {
    await insforge.database
        .from('reviews')
        .update({ is_flagged: true, flag_reason: req.body.reason })
        .eq('id', req.params.id);

    ApiResponse.ok(null, 'Review flagged for moderation').send(res);
});
