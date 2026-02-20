/**
 * auth.controller.js — Authentication handlers.
 * Handles register, login, logout, token refresh, and password reset.
 */
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { insforge } from '../config/index.js';
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/index.js';
import { env } from '../config/index.js';

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.validatedBody;

    // Check if user exists
    const { data: existing } = await insforge.database
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (existing) {
        throw ApiError.conflict('Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    const { data: user, error } = await insforge.database
        .from('users')
        .insert({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
            role: 'guest',
            is_verified: false,
            is_email_verified: false,
            is_banned: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select('id, first_name, last_name, email, role, avatar, created_at')
        .single();

    if (error) throw ApiError.internal('Failed to create account');

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Store refresh token
    await insforge.database
        .from('users')
        .update({ refresh_token: refreshToken })
        .eq('id', user.id);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.isProd,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.created({
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
        accessToken,
    }, 'Account created successfully').send(res);
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.validatedBody;

    const { data: user, error } = await insforge.database
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (!user) throw ApiError.unauthorized('Invalid credentials');
    if (user.is_banned) throw ApiError.forbidden('Account has been suspended');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw ApiError.unauthorized('Invalid credentials');

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Update refresh token and last login
    await insforge.database
        .from('users')
        .update({
            refresh_token: refreshToken,
            last_login: new Date().toISOString(),
        })
        .eq('id', user.id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.isProd,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok({
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            bio: user.bio,
        },
        accessToken,
    }, 'Login successful').send(res);
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
        // Clear refresh token from DB
        try {
            const decoded = verifyRefreshToken(refreshToken);
            await insforge.database
                .from('users')
                .update({ refresh_token: null })
                .eq('id', decoded.userId);
        } catch {
            // Token invalid, just clear the cookie
        }
    }

    res.clearCookie('refreshToken');
    ApiResponse.ok(null, 'Logged out successfully').send(res);
});

/**
 * POST /api/auth/refresh-token
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw ApiError.unauthorized('No refresh token');

    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch {
        throw ApiError.unauthorized('Invalid refresh token');
    }

    const { data: user } = await insforge.database
        .from('users')
        .select('id, role, refresh_token, is_banned')
        .eq('id', decoded.userId)
        .single();

    if (!user || user.refresh_token !== refreshToken) {
        throw ApiError.unauthorized('Invalid refresh token');
    }

    if (user.is_banned) {
        throw ApiError.forbidden('Account has been suspended');
    }

    const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    await insforge.database
        .from('users')
        .update({ refresh_token: newRefreshToken })
        .eq('id', user.id);

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: env.isProd,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok({ accessToken: newAccessToken }, 'Token refreshed').send(res);
});

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.validatedBody;

    const { data: user } = await insforge.database
        .from('users')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

    // Always return success to prevent email enumeration
    if (!user) {
        return ApiResponse.ok(null, 'If that email exists, a reset link has been sent').send(res);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await insforge.database
        .from('users')
        .update({
            password_reset_token: hashedToken,
            password_reset_expires: expires,
        })
        .eq('id', user.id);

    // TODO: Send email with reset link
    // const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

    ApiResponse.ok(null, 'If that email exists, a reset link has been sent').send(res);
});

/**
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.validatedBody;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data: user } = await insforge.database
        .from('users')
        .select('id, password_reset_expires')
        .eq('password_reset_token', hashedToken)
        .maybeSingle();

    if (!user) throw ApiError.badRequest('Invalid or expired reset token');

    if (new Date(user.password_reset_expires) < new Date()) {
        throw ApiError.badRequest('Reset token has expired');
    }

    const hashedPassword = await hashPassword(password);

    await insforge.database
        .from('users')
        .update({
            password: hashedPassword,
            password_reset_token: null,
            password_reset_expires: null,
            refresh_token: null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    ApiResponse.ok(null, 'Password reset successfully').send(res);
});

/**
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
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
