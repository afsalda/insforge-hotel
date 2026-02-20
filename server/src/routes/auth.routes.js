/**
 * auth.routes.js — Authentication route definitions.
 */
import { Router } from 'express';
import {
    register,
    login,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    getMe,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/index.js';
import validate from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '@staybnb/shared/schemas/auth.schema.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, getMe);

export default router;
