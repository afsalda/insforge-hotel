/**
 * admin/index.js — Mount all admin route groups under /api/admin.
 */
import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/index.js';
import dashboardRoutes from './dashboard.routes.js';
import usersRoutes from './users.routes.js';
import listingsRoutes from './listings.routes.js';
import bookingsRoutes from './bookings.routes.js';
import reviewsRoutes from './reviews.routes.js';
import categoriesRoutes from './categories.routes.js';
import amenitiesRoutes from './amenities.routes.js';
import payoutsRoutes from './payouts.routes.js';
import reportsRoutes from './reports.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.use('/dashboard', dashboardRoutes);
router.use('/users', usersRoutes);
router.use('/listings', listingsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/amenities', amenitiesRoutes);
router.use('/payouts', payoutsRoutes);
router.use('/reports', reportsRoutes);
router.use('/settings', settingsRoutes);

export default router;
