/**
 * payment.controller.js — Stripe payment handlers.
 */
import { stripe, env } from '../config/index.js';
import { insforge } from '../config/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

export const createCheckoutSession = asyncHandler(async (req, res) => {
    if (!stripe) throw ApiError.internal('Stripe is not configured');

    const { bookingId } = req.body;

    const { data: booking } = await insforge.database
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('guest_id', req.user.id)
        .single();

    if (!booking) throw ApiError.notFound('Booking');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: booking.pricing_currency.toLowerCase(),
                    product_data: { name: `StayBnB Booking ${booking.booking_number}` },
                    unit_amount: Math.round(booking.pricing_total * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${env.CLIENT_URL}/booking-success?bookingId=${bookingId}`,
        cancel_url: `${env.CLIENT_URL}/checkout?bookingId=${bookingId}`,
        metadata: { bookingId },
    });

    ApiResponse.ok({ sessionId: session.id, url: session.url }).send(res);
});

export const handleWebhook = asyncHandler(async (req, res) => {
    if (!stripe) return res.json({ received: true });

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        throw ApiError.badRequest(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { bookingId } = session.metadata;

        await insforge.database
            .from('bookings')
            .update({
                payment_status: 'paid',
                payment_intent_id: session.payment_intent,
                status: 'confirmed',
                updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId);
    }

    res.json({ received: true });
});

export const getHostBalance = asyncHandler(async (req, res) => {
    // Placeholder — requires Stripe Connect setup
    ApiResponse.ok({ balance: 0, currency: 'usd' }).send(res);
});

export const onboardHost = asyncHandler(async (req, res) => {
    if (!stripe) throw ApiError.internal('Stripe is not configured');

    const account = await stripe.accounts.create({
        type: 'express',
        email: req.user.email,
        capabilities: {
            transfers: { requested: true },
        },
    });

    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${env.CLIENT_URL}/host/earnings`,
        return_url: `${env.CLIENT_URL}/host/earnings?onboarded=true`,
        type: 'account_onboarding',
    });

    // Store Stripe Connect ID
    await insforge.database
        .from('users')
        .update({ stripe_connect_id: account.id })
        .eq('id', req.user.id);

    ApiResponse.ok({ url: accountLink.url }).send(res);
});
