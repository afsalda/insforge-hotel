/**
 * listing.schema.js — Zod validation schemas for listings.
 */
import { z } from 'zod';
import { PROPERTY_TYPES } from '../constants/propertyTypes.js';

const propertyTypeValues = Object.values(PROPERTY_TYPES);

export const createListingSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100),
    description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
    propertyType: z.enum(propertyTypeValues, { message: 'Invalid property type' }),
    categoryId: z.string().uuid('Invalid category'),
    location: z.object({
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().optional(),
        country: z.string().min(1, 'Country is required'),
        zipCode: z.string().optional(),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
    }),
    details: z.object({
        bedrooms: z.number().int().min(0),
        bathrooms: z.number().min(0),
        beds: z.number().int().min(1, 'At least 1 bed required'),
        maxGuests: z.number().int().min(1, 'At least 1 guest required'),
    }),
    amenityIds: z.array(z.string().uuid()).optional().default([]),
    pricing: z.object({
        perNight: z.number().min(1, 'Nightly rate must be at least 1'),
        cleaningFee: z.number().min(0).default(0),
        currency: z.string().default('USD'),
    }),
    availability: z.object({
        minNights: z.number().int().min(1).default(1),
        maxNights: z.number().int().min(1).default(365),
        instantBook: z.boolean().default(false),
    }).optional(),
    houseRules: z.object({
        checkIn: z.string().default('15:00'),
        checkOut: z.string().default('11:00'),
        petsAllowed: z.boolean().default(false),
        smokingAllowed: z.boolean().default(false),
        partiesAllowed: z.boolean().default(false),
        additionalRules: z.string().max(2000).optional(),
    }).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const listingSearchSchema = z.object({
    location: z.string().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    guests: z.coerce.number().int().min(1).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    propertyType: z.string().optional(),
    categoryId: z.string().optional(),
    amenities: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
});
