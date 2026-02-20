/**
 * routes/index.js — Mount all API route groups.
 */
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import listingRoutes from './listing.routes.js';
import bookingRoutes from './booking.routes.js';
import reviewRoutes from './review.routes.js';
import messageRoutes from './message.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import uploadRoutes from './upload.routes.js';
import paymentRoutes from './payment.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin/index.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/listings', listingRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/uploads', uploadRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
