import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
// @ts-ignore — JS utility module
import { sendWhatsApp } from "./utils/sendWhatsApp.js";
import { sendBookingEmails } from "./send-booking-email";

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

        // ─── Log WhatsApp config status ───
        console.log("WhatsApp config:", {
            WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID ? "✅ set" : "❌ missing",
            WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN ? "✅ set" : "❌ missing",
            WHATSAPP_OWNER_PHONE: process.env.WHATSAPP_OWNER_PHONE ? "✅ set" : "❌ missing",
            customerPhone,
            guestPhoneRaw: guestPhone,
        });

        // Format dates for human-readable WhatsApp messages
        const formatDate = (dateStr: string): string => {
            if (!dateStr) return "N/A";
            try {
                return new Date(dateStr).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                });
            } catch {
                return dateStr;
            }
        };

        const formattedCheckIn = formatDate(checkInDate);
        const formattedCheckOut = formatDate(checkOutDate);

        // ─── Step 3: Send WhatsApp to Customer ───
        if (customerPhone) {
            try {
                const result = await sendWhatsApp(
                    customerPhone,
                    "_booking_confirmed",
                    // Body parameters (6): name, room, check-in, check-out, amount paid, due amount
                    [
                        guestName || "Guest",
                        listingTitle || "Room",
                        formattedCheckIn,
                        formattedCheckOut,
                        `₹${depositAmount || 0}`,
                        `₹${(totalPrice || 0) - (depositAmount || 0)}`
                    ],
                    // Header parameter (1): booking number
                    [bookingNumber || "Confirmed"]
                );
                console.log("✅ Customer WhatsApp sent:", result?.messages?.[0]?.id || "ok");
            } catch (waErr: any) {
                console.error("❌ Customer WhatsApp failed:", waErr.message);
                // Non-blocking — booking is still confirmed
            }
        } else {
            console.warn("⚠️ Customer phone empty — skipping customer notification");
        }

        // ─── Step 4: Send WhatsApp to Hotel Owners ───
        const ownerPhoneString = process.env.WHATSAPP_OWNER_PHONE;
        if (ownerPhoneString) {
            const ownerPhones = ownerPhoneString.split(",").map(p => p.trim()).filter(p => p.length > 0);
            
            for (const phone of ownerPhones) {
                try {
                    const result = await sendWhatsApp(phone, "new_booking_alert", [
                        guestName || "Guest",
                        listingTitle || "Room",
                        formattedCheckIn,
                        formattedCheckOut
                    ]);
                    console.log(`✅ Owner WhatsApp sent to ${phone}:`, result?.messages?.[0]?.id || "ok");
                } catch (waErr: any) {
                    console.error(`❌ Owner WhatsApp failed for ${phone}:`, waErr.message);
                }
            }
        } else {
            console.warn("⚠️ WHATSAPP_OWNER_PHONE not set — owner notification skipped");
        }


        // ─── Step 5: Send booking confirmation emails (direct call, no HTTP) ───
        try {
            const emailResult = await sendBookingEmails({
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
            });
            console.log('📧 Email result:', JSON.stringify(emailResult));
        } catch (emailError: any) {
            // Email failure must never block the payment success response
            console.error('❌ Email notification failed (non-critical):', emailError.message || emailError);
        }

        // ─── Step 6: Return success ───
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
