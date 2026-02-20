/**
 * booking.controller.js — Booking management handlers.
 * Implements availability checks, price calculation, and booking lifecycle.
 */
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../config/index.js';
import { ApiError, ApiResponse, asyncHandler, datesOverlap } from '../utils/index.js';
import { getPaginationRange, buildPaginationMeta } from '../utils/pagination.js';
import { calculateBookingTotal, calculateNights } from '@staybnb/shared/utils/calculateBooking.js';
import { PLATFORM_DEFAULTS } from '@staybnb/shared/constants/index.js';

/**
 * POST /api/bookings — Create a new booking
 */
export const createBooking = asyncHandler(async (req, res) => {
    const { listingId, checkIn, checkOut, guests, specialRequests } = req.validatedBody;

    // Get listing
    const { data: listing } = await insforge.database
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .eq('status', 'active')
        .single();

    if (!listing) throw ApiError.notFound('Listing');

    // Rule #10: Guest cannot book their own listing
    if (listing.host_id === req.user.id) {
        throw ApiError.badRequest('You cannot book your own listing');
    }

    // Check guest count
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > listing.details_max_guests) {
        throw ApiError.badRequest(`Maximum ${listing.details_max_guests} guests allowed`);
    }

    // Calculate nights and enforce min/max
    const nights = calculateNights(checkIn, checkOut);
    if (nights < listing.availability_min_nights) {
        throw ApiError.badRequest(`Minimum stay is ${listing.availability_min_nights} nights`);
    }
    if (nights > listing.availability_max_nights) {
        throw ApiError.badRequest(`Maximum stay is ${listing.availability_max_nights} nights`);
    }

    // Rule #11: Check for date overlap with existing bookings
    const { data: existingBookings } = await insforge.database
        .from('bookings')
        .select('check_in, check_out')
        .eq('listing_id', listingId)
        .in('status', ['pending', 'confirmed']);

    const hasOverlap = existingBookings?.some((b) =>
        datesOverlap(checkIn, checkOut, b.check_in, b.check_out)
    );

    if (hasOverlap) {
        throw ApiError.conflict('Selected dates are not available');
    }

    // Rule #17: Price calculation
    const pricing = calculateBookingTotal(
        nights,
        listing.pricing_per_night,
        listing.pricing_cleaning_fee,
        PLATFORM_DEFAULTS.SERVICE_FEE_PERCENT,
        0 // taxes — can be computed by region
    );

    const platformFee = Math.round((pricing.total * PLATFORM_DEFAULTS.PLATFORM_COMMISSION_PERCENT) / 100);
    const hostPayout = pricing.total - platformFee;

    // Generate booking number
    const year = new Date().getFullYear();
    const seq = Date.now().toString().slice(-5);
    const bookingNumber = `BK-${year}-${seq}`;

    const bookingId = uuidv4();

    const booking = {
        id: bookingId,
        booking_number: bookingNumber,
        listing_id: listingId,
        guest_id: req.user.id,
        host_id: listing.host_id,
        check_in: checkIn,
        check_out: checkOut,
        nights,
        guests_adults: guests.adults,
        guests_children: guests.children || 0,
        guests_infants: guests.infants || 0,
        pricing_nightly_rate: listing.pricing_per_night,
        pricing_nights: nights,
        pricing_subtotal: pricing.subtotal,
        pricing_cleaning_fee: pricing.cleaningFee,
        pricing_service_fee: pricing.serviceFee,
        pricing_taxes: pricing.taxes,
        pricing_total: pricing.total,
        pricing_host_payout: hostPayout,
        pricing_platform_fee: platformFee,
        pricing_currency: listing.pricing_currency || 'USD',
        status: listing.availability_instant_book ? 'confirmed' : 'pending',
        payment_status: 'pending',
        special_requests: specialRequests || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await insforge.database
        .from('bookings')
        .insert(booking)
        .select()
        .single();

    if (error) throw ApiError.internal('Failed to create booking');

    // Increment booking count on listing
    await insforge.database
        .from('listings')
        .update({ booking_count: (listing.booking_count || 0) + 1 })
        .eq('id', listingId);

    ApiResponse.created(data, 'Booking created').send(res);
});

/**
 * POST /api/bookings/check-availability
 */
export const checkAvailability = asyncHandler(async (req, res) => {
    const { listingId, checkIn, checkOut } = req.validatedBody;

    const { data: bookings } = await insforge.database
        .from('bookings')
        .select('check_in, check_out')
        .eq('listing_id', listingId)
        .in('status', ['pending', 'confirmed']);

    const hasOverlap = bookings?.some((b) =>
        datesOverlap(checkIn, checkOut, b.check_in, b.check_out)
    );

    ApiResponse.ok({ available: !hasOverlap }).send(res);
});

/**
 * GET /api/bookings/my-bookings
 */
export const getMyBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    let query = insforge.database
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('guest_id', req.user.id);

    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: bookings, count } = await query;

    ApiResponse.ok({
        bookings: bookings || [],
        pagination: buildPaginationMeta(Number(page), Number(limit), count || 0),
    }).send(res);
});

/**
 * GET /api/bookings/host-bookings
 */
export const getHostBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    let query = insforge.database
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('host_id', req.user.id);

    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: bookings, count } = await query;

    ApiResponse.ok({
        bookings: bookings || [],
        pagination: buildPaginationMeta(Number(page), Number(limit), count || 0),
    }).send(res);
});

/**
 * GET /api/bookings/:id
 */
export const getBookingById = asyncHandler(async (req, res) => {
    const { data: booking, error } = await insforge.database
        .from('bookings')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error || !booking) throw ApiError.notFound('Booking');

    // Only guest, host, or admin can view
    if (booking.guest_id !== req.user.id && booking.host_id !== req.user.id && req.user.role !== 'admin') {
        throw ApiError.forbidden();
    }

    ApiResponse.ok(booking).send(res);
});

/**
 * PATCH /api/bookings/:id/confirm
 */
export const confirmBooking = asyncHandler(async (req, res) => {
    const { data: booking } = await insforge.database
        .from('bookings')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (!booking) throw ApiError.notFound('Booking');
    if (booking.host_id !== req.user.id) throw ApiError.forbidden();
    if (booking.status !== 'pending') throw ApiError.badRequest('Only pending bookings can be confirmed');

    const { data } = await insforge.database
        .from('bookings')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, 'Booking confirmed').send(res);
});

/**
 * PATCH /api/bookings/:id/cancel
 */
export const cancelBooking = asyncHandler(async (req, res) => {
    const { data: booking } = await insforge.database
        .from('bookings')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (!booking) throw ApiError.notFound('Booking');

    // Only guest, host, or admin can cancel
    const isGuest = booking.guest_id === req.user.id;
    const isHost = booking.host_id === req.user.id;
    if (!isGuest && !isHost && req.user.role !== 'admin') {
        throw ApiError.forbidden();
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
        throw ApiError.badRequest('This booking cannot be cancelled');
    }

    const cancelledBy = isGuest ? 'guest' : isHost ? 'host' : 'admin';

    const { data } = await insforge.database
        .from('bookings')
        .update({
            status: 'cancelled',
            cancellation_reason: req.body.reason || null,
            cancelled_by: cancelledBy,
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, 'Booking cancelled').send(res);
});

/**
 * PATCH /api/bookings/:id/complete
 */
export const completeBooking = asyncHandler(async (req, res) => {
    const { data: booking } = await insforge.database
        .from('bookings')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (!booking) throw ApiError.notFound('Booking');
    if (booking.host_id !== req.user.id && req.user.role !== 'admin') throw ApiError.forbidden();
    if (booking.status !== 'confirmed') throw ApiError.badRequest('Only confirmed bookings can be completed');

    const { data } = await insforge.database
        .from('bookings')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, 'Booking completed').send(res);
});
