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
        const keyId = process.env.RAZORPAY_KEY_ID?.trim();
        const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

        if (!keyId || !keySecret) {
            console.error("Missing Razorpay env vars:", { keyId: !!keyId, keySecret: !!keySecret });
            return res.status(500).json({
                error: "Server misconfiguration: Razorpay credentials not found",
                details: { keyId: !!keyId, keySecret: !!keySecret }
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
        
        const numericPrice = Number(totalPrice);

        // Validate required fields
        if (!guestName || !guestEmail || !guestPhone || !checkInDate || !totalPrice) {
            return res.status(400).json({ error: "Missing required booking fields" });
        }

        // Calculate 30% deposit (in paise for Razorpay — INR × 100)
        // Ensure a minimum of 100 paise (1 INR) for Razorpay API constraints
        const depositAmount = Math.round(numericPrice * 0.3);
        const depositPaise = Math.max(100, Math.floor(depositAmount * 100));

        // Generate booking reference based on room type
        const getPrefix = (rId: string, title: string) => {
            const id = (rId || "").toLowerCase();
            const t = (title || "").toLowerCase();
            if (id === "standard" || t.includes("standard")) return "STD";
            if (id === "deluxe" || t.includes("deluxe")) return "DLX";
            if (id === "suite" || t.includes("suite")) return "STE";
            if (id === "apt1" || t.includes("1bhk")) return "A1";
            if (id === "apt2" || t.includes("2bhk")) return "A2";
            if (id === "apt3" || t.includes("3bhk")) return "A3";
            return "ALB";
        };

        const prefix = getPrefix(roomId, listingTitle);
        const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random
        const bookingNumber = `${prefix}-${randomPart}`;

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
                key: keyId,
            },
        });
    } catch (error: any) {
        console.error("Create booking error:", error);
        
        // Handle Razorpay specific errors
        const errorMessage = error.error?.description || error.message || "Internal server error";
        return res.status(500).json({ 
            error: errorMessage,
            code: error.error?.code || 'UNKNOWN_ERROR'
        });
    }
}
