/**
 * listing.controller.js — Listing CRUD, search, and filter handlers.
 */
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../config/index.js';
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    logger,
} from '../utils/index.js';
import { getPaginationRange, buildPaginationMeta } from '../utils/pagination.js';
import { generateSlug } from '@staybnb/shared/utils/slugify.js';

/**
 * GET /api/listings — Search listings with filters
 */
export const getListings = asyncHandler(async (req, res) => {
    const {
        location, checkIn, checkOut, guests,
        minPrice, maxPrice, propertyType, categoryId,
        amenities, sort, page = 1, limit = 12,
    } = req.query;

    const { from, to } = getPaginationRange(Number(page), Number(limit));

    let query = insforge.database
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

    // Filters
    if (location) query = query.ilike('location_city', `%${location}%`);
    if (propertyType) query = query.eq('property_type', propertyType);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (minPrice) query = query.gte('pricing_per_night', Number(minPrice));
    if (maxPrice) query = query.lte('pricing_per_night', Number(maxPrice));
    if (guests) query = query.gte('details_max_guests', Number(guests));

    // Sort
    switch (sort) {
        case 'price_asc':
            query = query.order('pricing_per_night', { ascending: true });
            break;
        case 'price_desc':
            query = query.order('pricing_per_night', { ascending: false });
            break;
        case 'rating':
            query = query.order('avg_rating', { ascending: false });
            break;
        default:
            query = query.order('created_at', { ascending: false });
    }

    query = query.range(from, to);

    const { data: listings, error, count } = await query;

    if (error) {
        logger.error('Listings fetch failed', { error: error.message });
        throw ApiError.internal('Failed to fetch listings');
    }

    ApiResponse.ok({
        listings: listings || [],
        pagination: buildPaginationMeta(Number(page), Number(limit), count || 0),
    }).send(res);
});

/**
 * GET /api/listings/featured
 */
export const getFeaturedListings = asyncHandler(async (req, res) => {
    const { data: listings } = await insforge.database
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

    ApiResponse.ok(listings || []).send(res);
});

/**
 * GET /api/listings/categories/:slug
 */
export const getListingsByCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    // Find category by slug
    const { data: category } = await insforge.database
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single();

    if (!category) throw ApiError.notFound('Category');

    const { data: listings, count } = await insforge.database
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false })
        .range(from, to);

    ApiResponse.ok({
        listings: listings || [],
        pagination: buildPaginationMeta(Number(page), Number(limit), count || 0),
    }).send(res);
});

/**
 * GET /api/listings/:id
 */
export const getListingById = asyncHandler(async (req, res) => {
    const { data: listing, error } = await insforge.database
        .from('listings')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error || !listing) throw ApiError.notFound('Listing');

    // Get host info
    const { data: host } = await insforge.database
        .from('users')
        .select('id, first_name, last_name, avatar, bio, is_verified, created_at')
        .eq('id', listing.host_id)
        .single();

    ApiResponse.ok({ ...listing, host }).send(res);
});

/**
 * GET /api/listings/:id/availability
 */
export const checkAvailability = asyncHandler(async (req, res) => {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) throw ApiError.badRequest('checkIn and checkOut are required');

    // Get blocked dates and existing bookings
    const { data: listing } = await insforge.database
        .from('listings')
        .select('id, availability_blocked_dates, availability_min_nights, availability_max_nights')
        .eq('id', req.params.id)
        .single();

    if (!listing) throw ApiError.notFound('Listing');

    const { data: bookings } = await insforge.database
        .from('bookings')
        .select('check_in, check_out')
        .eq('listing_id', req.params.id)
        .in('status', ['pending', 'confirmed']);

    // Check for overlaps
    const requestStart = new Date(checkIn);
    const requestEnd = new Date(checkOut);
    const isBooked = bookings?.some((b) => {
        const bStart = new Date(b.check_in);
        const bEnd = new Date(b.check_out);
        return requestStart < bEnd && bStart < requestEnd;
    });

    ApiResponse.ok({ available: !isBooked }).send(res);
});

/**
 * POST /api/listings
 */
export const createListing = asyncHandler(async (req, res) => {
    const body = req.validatedBody;
    const listingId = uuidv4();
    const slug = generateSlug(body.title) + '-' + listingId.slice(0, 8);

    const listing = {
        id: listingId,
        host_id: req.user.id,
        title: body.title,
        slug,
        description: body.description,
        property_type: body.propertyType,
        category_id: body.categoryId,
        location_address: body.location.address,
        location_city: body.location.city,
        location_state: body.location.state || null,
        location_country: body.location.country,
        location_zip_code: body.location.zipCode || null,
        location_lat: body.location.lat,
        location_lng: body.location.lng,
        details_bedrooms: body.details.bedrooms,
        details_bathrooms: body.details.bathrooms,
        details_beds: body.details.beds,
        details_max_guests: body.details.maxGuests,
        amenity_ids: body.amenityIds || [],
        photos: body.photos || [],
        pricing_per_night: body.pricing.perNight,
        pricing_cleaning_fee: body.pricing.cleaningFee || 0,
        pricing_currency: body.pricing.currency || 'USD',
        availability_min_nights: body.availability?.minNights || 1,
        availability_max_nights: body.availability?.maxNights || 365,
        availability_instant_book: body.availability?.instantBook || false,
        availability_blocked_dates: [],
        house_rules_check_in: body.houseRules?.checkIn || '15:00',
        house_rules_check_out: body.houseRules?.checkOut || '11:00',
        house_rules_pets: body.houseRules?.petsAllowed || false,
        house_rules_smoking: body.houseRules?.smokingAllowed || false,
        house_rules_parties: body.houseRules?.partiesAllowed || false,
        house_rules_additional: body.houseRules?.additionalRules || null,
        status: 'pending',
        is_featured: false,
        avg_rating: 0,
        total_reviews: 0,
        view_count: 0,
        booking_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await insforge.database
        .from('listings')
        .insert(listing)
        .select()
        .single();

    if (error) {
        logger.error('Create listing failed', { error: error.message });
        throw ApiError.internal('Failed to create listing');
    }

    ApiResponse.created(data, 'Listing created').send(res);
});

/**
 * PUT /api/listings/:id
 */
export const updateListing = asyncHandler(async (req, res) => {
    // Verify ownership
    const { data: existing } = await insforge.database
        .from('listings')
        .select('id, host_id')
        .eq('id', req.params.id)
        .single();

    if (!existing) throw ApiError.notFound('Listing');
    if (existing.host_id !== req.user.id && req.user.role !== 'admin') {
        throw ApiError.forbidden('You can only edit your own listings');
    }

    const body = req.validatedBody;
    const updates = { updated_at: new Date().toISOString() };

    if (body.title) updates.title = body.title;
    if (body.description) updates.description = body.description;
    if (body.propertyType) updates.property_type = body.propertyType;
    if (body.categoryId) updates.category_id = body.categoryId;
    if (body.location) {
        if (body.location.address) updates.location_address = body.location.address;
        if (body.location.city) updates.location_city = body.location.city;
        if (body.location.state !== undefined) updates.location_state = body.location.state;
        if (body.location.country) updates.location_country = body.location.country;
        if (body.location.lat) updates.location_lat = body.location.lat;
        if (body.location.lng) updates.location_lng = body.location.lng;
    }
    if (body.details) {
        if (body.details.bedrooms !== undefined) updates.details_bedrooms = body.details.bedrooms;
        if (body.details.bathrooms !== undefined) updates.details_bathrooms = body.details.bathrooms;
        if (body.details.beds !== undefined) updates.details_beds = body.details.beds;
        if (body.details.maxGuests !== undefined) updates.details_max_guests = body.details.maxGuests;
    }
    if (body.amenityIds) updates.amenity_ids = body.amenityIds;
    if (body.pricing) {
        if (body.pricing.perNight) updates.pricing_per_night = body.pricing.perNight;
        if (body.pricing.cleaningFee !== undefined) updates.pricing_cleaning_fee = body.pricing.cleaningFee;
    }

    const { data, error } = await insforge.database
        .from('listings')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) throw ApiError.internal('Failed to update listing');

    ApiResponse.ok(data, 'Listing updated').send(res);
});

/**
 * DELETE /api/listings/:id
 */
export const deleteListing = asyncHandler(async (req, res) => {
    const { data: listing } = await insforge.database
        .from('listings')
        .select('id, host_id')
        .eq('id', req.params.id)
        .single();

    if (!listing) throw ApiError.notFound('Listing');
    if (listing.host_id !== req.user.id && req.user.role !== 'admin') {
        throw ApiError.forbidden('You can only delete your own listings');
    }

    // Check for active bookings (business rule #16)
    const { data: activeBookings } = await insforge.database
        .from('bookings')
        .select('id')
        .eq('listing_id', req.params.id)
        .in('status', ['pending', 'confirmed']);

    if (activeBookings?.length > 0) {
        throw ApiError.conflict('Cannot delete listing with active bookings');
    }

    await insforge.database
        .from('listings')
        .delete()
        .eq('id', req.params.id);

    ApiResponse.ok(null, 'Listing deleted').send(res);
});

/**
 * GET /api/listings/host/my-listings
 */
export const getHostListings = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12, status } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    let query = insforge.database
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('host_id', req.user.id);

    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: listings, count } = await query;

    ApiResponse.ok({
        listings: listings || [],
        pagination: buildPaginationMeta(Number(page), Number(limit), count || 0),
    }).send(res);
});

/**
 * PATCH /api/listings/:id/status
 */
export const toggleListingStatus = asyncHandler(async (req, res) => {
    const { data: listing } = await insforge.database
        .from('listings')
        .select('id, host_id, status')
        .eq('id', req.params.id)
        .single();

    if (!listing) throw ApiError.notFound('Listing');
    if (listing.host_id !== req.user.id) {
        throw ApiError.forbidden('You can only modify your own listings');
    }

    const newStatus = listing.status === 'active' ? 'inactive' : 'active';

    const { data } = await insforge.database
        .from('listings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

    ApiResponse.ok(data, `Listing ${newStatus}`).send(res);
});

/**
 * POST /api/listings/:id/view
 */
export const incrementViewCount = asyncHandler(async (req, res) => {
    // Simple increment — use RPC for atomic increment in production
    const { data: listing } = await insforge.database
        .from('listings')
        .select('id, view_count')
        .eq('id', req.params.id)
        .single();

    if (!listing) throw ApiError.notFound('Listing');

    await insforge.database
        .from('listings')
        .update({ view_count: (listing.view_count || 0) + 1 })
        .eq('id', req.params.id);

    ApiResponse.ok(null).send(res);
});
