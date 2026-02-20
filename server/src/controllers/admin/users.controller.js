/**
 * admin/users.controller.js — Admin user management.
 */
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../../config/index.js';
import { ApiError, ApiResponse, asyncHandler, hashPassword } from '../../utils/index.js';
import { getPaginationRange, buildPaginationMeta } from '../../utils/pagination.js';

export const getUsers = asyncHandler(async (req, res) => {
    const { search, role, page = 1, limit = 20 } = req.query;
    const { from, to } = getPaginationRange(Number(page), Number(limit));

    let query = insforge.database
        .from('users')
        .select('id, first_name, last_name, email, role, avatar, is_banned, is_verified, created_at, last_login', { count: 'exact' });

    if (search) query = query.ilike('email', `%${search}%`);
    if (role) query = query.eq('role', role);
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count } = await query;
    ApiResponse.ok({ users: data || [], pagination: buildPaginationMeta(Number(page), Number(limit), count || 0) }).send(res);
});

export const getUserById = asyncHandler(async (req, res) => {
    const { data: user } = await insforge.database
        .from('users')
        .select('id, first_name, last_name, email, role, avatar, phone, bio, is_banned, is_verified, created_at, last_login')
        .eq('id', req.params.id)
        .single();

    if (!user) throw ApiError.notFound('User');
    ApiResponse.ok(user).send(res);
});

export const updateUser = asyncHandler(async (req, res) => {
    const { role, is_banned } = req.body;
    const updates = { updated_at: new Date().toISOString() };
    if (role) updates.role = role;
    if (is_banned !== undefined) updates.is_banned = is_banned;

    const { data } = await insforge.database
        .from('users')
        .update(updates)
        .eq('id', req.params.id)
        .select('id, first_name, last_name, email, role, is_banned')
        .single();

    ApiResponse.ok(data, 'User updated').send(res);
});

export const deleteUser = asyncHandler(async (req, res) => {
    await insforge.database.from('users').delete().eq('id', req.params.id);
    ApiResponse.ok(null, 'User deleted').send(res);
});

export const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const { data: existing } = await insforge.database
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (existing) throw ApiError.conflict('Email already exists');

    const hashed = await hashPassword(password);
    const { data } = await insforge.database
        .from('users')
        .insert({
            id: uuidv4(),
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashed,
            role: role || 'guest',
            is_verified: true,
            is_email_verified: true,
            is_banned: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select('id, first_name, last_name, email, role')
        .single();

    ApiResponse.created(data, 'User created').send(res);
});
