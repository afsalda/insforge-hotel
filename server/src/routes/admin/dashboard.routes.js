/**
 * admin/dashboard.routes.js
 */
import { Router } from 'express';
import { getStats, getCharts, getRecentActivity } from '../../controllers/admin/dashboard.controller.js';

const router = Router();

router.get('/stats', getStats);
router.get('/charts', getCharts);
router.get('/recent', getRecentActivity);

export default router;
