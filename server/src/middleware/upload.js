/**
 * upload.js — Multer file upload middleware configuration.
 * Restricts to images only, 5MB max per file.
 */
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(ApiError.badRequest('Only JPEG, PNG, and WebP images are allowed'), false);
    }
};

export const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
}).single('image');

export const uploadMultiple = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE, files: 10 },
}).array('images', 10);
