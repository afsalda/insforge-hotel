/**
 * upload.controller.js — Image upload/delete via Cloudinary.
 */
import { cloudinary } from '../config/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

export const uploadImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw ApiError.badRequest('No images provided');
    }

    const uploadPromises = req.files.map(
        (file) =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'staybnb/listings', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({ url: result.secure_url, publicId: result.public_id });
                    }
                );
                stream.end(file.buffer);
            })
    );

    const images = await Promise.all(uploadPromises);
    ApiResponse.ok(images, 'Images uploaded').send(res);
});

export const deleteImage = asyncHandler(async (req, res) => {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    ApiResponse.ok(null, 'Image deleted').send(res);
});
