import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Next.js Route Handler — Verify Razorpay Payment
 */

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingDetails,
        } = body;

        // Step 1: Verify Razorpay Signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
        if (!keySecret) {
            return NextResponse.json(
                { error: 'Server misconfiguration: missing payment secret' },
                { status: 500 }
            );
        }

        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error('Payment signature mismatch!');
            return NextResponse.json(
                { error: 'Payment verification failed — signature mismatch' },
                { status: 400 }
            );
        }

        console.log('✅ Payment verified:', razorpay_payment_id);

        // Step 2: Build booking data
        const {
            bookingNumber,
            guestName,
            guestEmail,
            guestPhone,
            listingTitle,
            checkInDate,
            checkOutDate,
            totalPrice,
            depositAmount,
            guestsCount,
            totalNights,
        } = bookingDetails || {};

        // Step 3: Send booking confirmation emails (fire-and-forget)
        try {
            const baseUrl = request.headers.get('host') || 'localhost:3000';
            const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
            fetch(`${protocol}://${baseUrl}/api/send-booking-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName: guestName || 'Guest',
                    guestEmail: guestEmail || '',
                    guestPhone: guestPhone || '',
                    roomName: listingTitle || 'Room',
                    checkIn: checkInDate || '',
                    checkOut: checkOutDate || '',
                    totalAmount: totalPrice || 0,
                    paidAmount: depositAmount || 0,
                    bookingId: bookingNumber || '',
                    paymentId: razorpay_payment_id || '',
                }),
            }).catch(() => {});
        } catch {}

        // Step 4: WhatsApp notification (fire-and-forget)
        try {
            const baseUrl = request.headers.get('host') || 'localhost:3000';
            const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
            fetch(`${protocol}://${baseUrl}/api/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'booking_confirmed',
                    bookingNumber,
                    guestName,
                    guestPhone,
                    listingTitle,
                    checkInDate,
                    checkOutDate,
                    totalPrice,
                    depositAmount,
                }),
            }).catch(() => {});
        } catch {}

        // Step 5: Return success
        return NextResponse.json({
            success: true,
            data: {
                bookingNumber,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                status: 'confirmed',
                guestName,
                guestEmail,
                guestPhone,
                listingTitle,
                checkInDate,
                checkOutDate,
                totalPrice,
                depositAmount,
                guestsCount,
                totalNights,
            },
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
