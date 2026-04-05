import type { VercelRequest, VercelResponse } from "@vercel/node";
import Razorpay from "razorpay";

/**
 * Vercel Serverless Function — Create Booking (Razorpay Order)
 *
 * Accepts booking details, calculates 30% deposit, creates a Razorpay order,
 * and returns the order ID + booking metadata for the frontend to complete payment.
 */

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        // Validate Razorpay env vars
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.error("Missing Razorpay env vars:", { keyId: !!keyId, keySecret: !!keySecret });
            return res.status(500).json({
                error: "Server misconfiguration: Razorpay credentials not found",
            });
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const {
            guestName,
            guestEmail,
            guestPhone,
            roomId,
            checkInDate,
            checkOutDate,
            listingTitle,
            guestsCount,
            totalPrice,
            totalNights,
        } = req.body;

        // Validate required fields
        if (!guestName || !guestEmail || !guestPhone || !checkInDate || !totalPrice) {
            return res.status(400).json({ error: "Missing required booking fields" });
        }

        // Calculate 30% deposit (in paise for Razorpay — INR × 100)
        const depositAmount = Math.round(totalPrice * 0.3);
        const depositPaise = depositAmount * 100;

        // Generate booking reference
        const year = new Date().getFullYear();
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        const bookingNumber = `ALB-${year}-${randomPart}`;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: depositPaise,
            currency: "INR",
            receipt: bookingNumber,
            notes: {
                booking_number: bookingNumber,
                guest_name: guestName,
                guest_email: guestEmail,
                guest_phone: guestPhone,
                room_id: roomId || "standard",
                check_in_date: checkInDate,
                check_out_date: checkOutDate || "",
                listing_title: listingTitle || "",
                guests_count: String(guestsCount || 1),
                total_price: String(totalPrice),
                total_nights: String(totalNights || 1),
                deposit_amount: String(depositAmount),
            },
        });

        return res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: depositPaise,
                currency: "INR",
                bookingNumber,
                depositAmount,
                totalPrice,
                key: process.env.RAZORPAY_KEY_ID,
            },
        });
    } catch (error: any) {
        console.error("Create booking error:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
}
