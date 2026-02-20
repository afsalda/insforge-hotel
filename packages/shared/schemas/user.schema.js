/**
 * user.schema.js — Zod validation schemas for user profile.
 */
import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    phone: z.string().max(20).optional(),
    bio: z.string().max(500).optional(),
    dateOfBirth: z.string().optional(),
});
