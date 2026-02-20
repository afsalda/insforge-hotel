/**
 * authenticate.js — JWT authentication middleware.
 * Verifies the access token from the Authorization header and attaches user to req.
 */
import { verifyAccessToken } from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';
import { insforge } from '../config/index.js';

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        // Fetch user from database to ensure they still exist and aren't banned
        const { data: user, error } = await insforge.database
            .from('users')
            .select('id, email, role, first_name, last_name, is_banned')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            throw ApiError.unauthorized('User not found');
        }

        if (user.is_banned) {
            throw ApiError.forbidden('Account has been suspended');
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            next(ApiError.unauthorized('Token expired'));
        } else if (err.name === 'JsonWebTokenError') {
            next(ApiError.unauthorized('Invalid token'));
        } else {
            next(err);
        }
    }
};

export default authenticate;
