/**
 * upload.routes.js — File upload route definitions.
 */
import { Router } from 'express';
import { uploadImages, deleteImage } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/index.js';
import { uploadMultiple } from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/images', authenticate, uploadLimiter, uploadMultiple, uploadImages);
router.delete('/images/:publicId', authenticate, deleteImage);

export default router;
