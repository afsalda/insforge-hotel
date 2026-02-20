/**
 * booking.schema.js — Zod validation schemas for bookings.
 */
import { z } from 'zod';

export const createBookingSchema = z.object({
    listingId: z.string().uuid('Invalid listing'),
    checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid check-in date'),
    checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid check-out date'),
    guests: z.object({
        adults: z.number().int().min(1, 'At least 1 adult required'),
        children: z.number().int().min(0).default(0),
        infants: z.number().int().min(0).default(0),
    }),
    specialRequests: z.string().max(1000).optional(),
}).refine(
    (data) => new Date(data.checkOut) > new Date(data.checkIn),
    { message: 'Check-out must be after check-in', path: ['checkOut'] }
);

export const checkAvailabilitySchema = z.object({
    listingId: z.string().uuid(),
    checkIn: z.string().refine((val) => !isNaN(Date.parse(val))),
    checkOut: z.string().refine((val) => !isNaN(Date.parse(val))),
});
