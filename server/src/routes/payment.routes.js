/**
 * payment.routes.js — Payment route definitions.
 */
import { Router } from 'express';
import express from 'express';
import { createCheckoutSession, handleWebhook, getHostBalance, onboardHost } from '../controllers/payment.controller.js';
import { authenticate, authorize } from '../middleware/index.js';

const router = Router();

router.post('/create-checkout', authenticate, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/host/balance', authenticate, authorize('host', 'admin'), getHostBalance);
router.post('/host/onboard', authenticate, authorize('host', 'admin'), onboardHost);

export default router;
