import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
// @ts-ignore — JS utility module
import { sendWhatsApp } from "./utils/sendWhatsApp.js";

/**
 * Vercel Serverless Function — Verify Payment
 *
 * 1. Verifies Razorpay payment signature (HMAC SHA256)
 * 2. Sends WhatsApp confirmation to customer (booking_confirmed template)
 * 3. Sends WhatsApp alert to hotel owner (new_booking_alert template)
 * 4. Returns booking confirmation to frontend
 */

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingDetails,
        } = req.body;

        // ─── Step 1: Verify Razorpay Signature ───
        const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
        if (!keySecret) {
            return res.status(500).json({ error: "Server misconfiguration: missing payment secret" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            console.error("Payment signature mismatch!");
            return res.status(400).json({ error: "Payment verification failed — signature mismatch" });
        }

        console.log("✅ Payment verified:", razorpay_payment_id);

        // ─── Step 2: Build booking data ───
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

        // Format phone for WhatsApp (ensure 91XXXXXXXXXX format)
        const formatPhone = (phone: string): string => {
            if (!phone) return "";
            const digits = phone.replace(/\D/g, "");
            // If 10 digits, prepend 91 (India)
            if (digits.length === 10) return `91${digits}`;
            // If already has country code
            return digits;
        };

        const customerPhone = formatPhone(guestPhone);

        // ─── Step 3: Send WhatsApp to Customer ───
        try {
            await sendWhatsApp(customerPhone, "_booking_confirmed", [
                guestName || "Guest",
                listingTitle || "Room",
                checkInDate || "N/A",
                checkOutDate || "N/A",
                `₹${depositAmount || 0}`
            ]);
        } catch (waErr: any) {
            console.error("Customer WhatsApp failed:", waErr.message);
            // Non-blocking — booking is still confirmed
        }

        // ─── Step 4: Send WhatsApp to Hotel Owner ───
        const ownerPhone = process.env.WHATSAPP_OWNER_PHONE;
        if (ownerPhone) {
            try {
                await sendWhatsApp(ownerPhone, "new_booking_alert", [
                    guestName || "Guest",
                    listingTitle || "Room",
                    checkInDate || "N/A",
                    checkOutDate || "N/A"
                ]);
            } catch (waErr: any) {
                console.error("Owner WhatsApp failed:", waErr.message);
            }
        } else {
            console.warn("⚠️ WHATSAPP_OWNER_PHONE not set — owner notification skipped");
        }


        // ─── Step 5: Return success ───
        return res.status(200).json({
            success: true,
            data: {
                bookingNumber,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                status: "confirmed",
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
    } catch (error: any) {
        console.error("Verify payment error:", error);
        return res.status(500).json({ 
            error: error.message || "Internal server error",
            details: error.toString()
        });
    }
}
