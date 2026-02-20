/**
 * authorize.js — Role-based access control middleware.
 * Restricts route access to specified roles.
 * Usage: authorize('admin', 'host')
 */
import ApiError from '../utils/ApiError.js';

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized());
        }

        if (!roles.includes(req.user.role)) {
            return next(
                ApiError.forbidden(
                    `Role "${req.user.role}" is not authorized to access this resource`
                )
            );
        }

        next();
    };
};

export default authorize;
