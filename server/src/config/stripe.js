/**
 * stripe.js — Stripe SDK instance.
 */
import Stripe from 'stripe';
import env from './env.js';

const stripe = env.STRIPE_SECRET_KEY
    ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
    : null;

export default stripe;
