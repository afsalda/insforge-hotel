/**
 * user.controller.js — User profile management handlers.
 */
import { insforge } from '../config/index.js';
import { ApiError, ApiResponse, asyncHandler, hashPassword, comparePassword } from '../utils/index.js';

export const getProfile = asyncHandler(async (req, res) => {
    const { data: user, error } = await insforge.database
        .from('users')
        .select('id, first_name, last_name, email, role, avatar, phone, bio, date_of_birth, is_verified, created_at')
        .eq('id', req.user.id)
        .single();

    if (error || !user) throw ApiError.notFound('User');

    ApiResponse.ok({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        dateOfBirth: user.date_of_birth,
        isVerified: user.is_verified,
        createdAt: user.created_at,
    }).send(res);
});

export const updateProfile = asyncHandler(async (req, res) => {
    const updates = {};
    const { firstName, lastName, phone, bio, dateOfBirth } = req.validatedBody;

    if (firstName) updates.first_name = firstName;
    if (lastName) updates.last_name = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (dateOfBirth) updates.date_of_birth = dateOfBirth;
    updates.updated_at = new Date().toISOString();

    const { data: user, error } = await insforge.database
        .from('users')
        .update(updates)
        .eq('id', req.user.id)
        .select('id, first_name, last_name, email, role, avatar, phone, bio, date_of_birth')
        .single();

    if (error) throw ApiError.internal('Failed to update profile');

    ApiResponse.ok({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        dateOfBirth: user.date_of_birth,
    }, 'Profile updated').send(res);
});

export const updateAvatar = asyncHandler(async (req, res) => {
    // Avatar URL comes from upload middleware/Cloudinary
    const { avatarUrl } = req.body;
    if (!avatarUrl) throw ApiError.badRequest('Avatar URL is required');

    const { data: user, error } = await insforge.database
        .from('users')
        .update({ avatar: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', req.user.id)
        .select('id, avatar')
        .single();

    if (error) throw ApiError.internal('Failed to update avatar');

    ApiResponse.ok({ avatar: user.avatar }, 'Avatar updated').send(res);
});

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.validatedBody;

    const { data: user } = await insforge.database
        .from('users')
        .select('id, password')
        .eq('id', req.user.id)
        .single();

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) throw ApiError.badRequest('Current password is incorrect');

    const hashed = await hashPassword(newPassword);
    await insforge.database
        .from('users')
        .update({ password: hashed, updated_at: new Date().toISOString() })
        .eq('id', req.user.id);

    ApiResponse.ok(null, 'Password changed successfully').send(res);
});

export const deleteAccount = asyncHandler(async (req, res) => {
    // Check for active bookings
    const { data: activeBookings } = await insforge.database
        .from('bookings')
        .select('id')
        .eq('guest_id', req.user.id)
        .in('status', ['pending', 'confirmed']);

    if (activeBookings?.length > 0) {
        throw ApiError.conflict('Cannot delete account with active bookings');
    }

    await insforge.database
        .from('users')
        .delete()
        .eq('id', req.user.id);

    res.clearCookie('refreshToken');
    ApiResponse.ok(null, 'Account deleted').send(res);
});

export const getPublicProfile = asyncHandler(async (req, res) => {
    const { data: user, error } = await insforge.database
        .from('users')
        .select('id, first_name, last_name, avatar, bio, is_verified, role, created_at')
        .eq('id', req.params.id)
        .single();

    if (error || !user) throw ApiError.notFound('User');

    // Count reviews received (as host)
    const { count: reviewCount } = await insforge.database
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('host_id', user.id);

    ApiResponse.ok({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.is_verified,
        role: user.role,
        createdAt: user.created_at,
        reviewCount: reviewCount || 0,
    }).send(res);
});
