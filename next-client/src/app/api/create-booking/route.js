import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
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
        } = body;

        // Validate Razorpay env vars
        const keyId = process.env.RAZORPAY_KEY_ID?.trim();
        const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

        if (!keyId || !keySecret) {
            console.error("Missing Razorpay env vars:", { keyId: !!keyId, keySecret: !!keySecret });
            return NextResponse.json(
                {
                    error: "Server misconfiguration: Razorpay credentials not found",
                    details: { keyId: !!keyId, keySecret: !!keySecret }
                },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const numericPrice = Number(totalPrice);

        // Validate required fields
        if (!guestName || !guestEmail || !guestPhone || !checkInDate || !totalPrice) {
            return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
        }

        // Calculate 30% deposit (in paise for Razorpay — INR × 100)
        const depositAmount = Math.round(numericPrice * 0.3);
        const depositPaise = Math.max(100, Math.floor(depositAmount * 100));

        // Generate booking reference
        const getPrefix = (rId, title) => {
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
        const randomPart = Math.floor(1000 + Math.random() * 9000);
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

        return NextResponse.json({
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
    } catch (error) {
        console.error("Create booking error:", error);
        const errorMessage = error.error?.description || error.message || "Internal server error";
        return NextResponse.json(
            { 
                error: errorMessage,
                code: error.error?.code || 'UNKNOWN_ERROR'
            },
            { status: 500 }
        );
    }
}
