/**
 * user.routes.js — User profile route definitions.
 */
import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    updateAvatar,
    changePassword,
    deleteAccount,
    getPublicProfile,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/index.js';
import validate from '../middleware/validate.js';
import { updateProfileSchema, changePasswordSchema } from '@staybnb/shared/schemas/index.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.patch('/avatar', authenticate, updateAvatar);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);
router.delete('/account', authenticate, deleteAccount);
router.get('/:id/public', getPublicProfile);

export default router;
