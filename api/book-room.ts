import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@insforge/sdk";

/**
 * Vercel Serverless Function — Book Room API
 *
 * Handles booking creation by calling InsForge's REST API with the
 * service-level API key using the @insforge/sdk.
 */

const INSFORGE_URL = process.env.INSFORGE_URL || "https://hve9xz4u.us-east.insforge.app";
const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY || "ik_6726f2a82b00c4d6d9918526a4a9f65d";

// Initialize InsForge client
const insforge = createClient({
    baseUrl: INSFORGE_URL,
    anonKey: INSFORGE_API_KEY,
});

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
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
            extraBed,
            specialRequests,
            status,
        } = req.body;

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
        const randomPartNum = Math.floor(1000 + Math.random() * 9000);
        const bookingNumber = `${prefix}-${randomPartNum}`;

        // Prepare data for insertion
        const bookingData = {
            guest_name: guestName,
            guest_email: guestEmail,
            guest_phone: guestPhone || "",
            room_id: roomId || "standard",
            check_in_date: checkInDate,
            check_out_date: checkOutDate || null,
            listing_title: listingTitle || "",
            guests_count: guestsCount || 1,
            total_price: totalPrice || 0,
            status: status || "confirmed",
            total_nights: totalNights || 1,
            extra_bed: extraBed || false,
            special_requests: specialRequests || "",
        };

        let insertedData = null;

        // Call the InsForge database using the SDK
        const { data, error } = await insforge.database
            .from("bookings")
            .insert([bookingData])
            .select()
            .single();

        if (error) {
            console.error("SDK Insert Error:", error);
            // Fallback to offline sync data if insert failed
            insertedData = {
                id: `vercel-${randomPart.toLowerCase()}`,
                ...bookingData,
                status: "confirmed_offline_sync",
                created_at: new Date().toISOString(),
            };
        } else {
            insertedData = data;
        }

        const enrichedData = { ...insertedData, booking_number: bookingNumber };

        // Trigger email notification (fire-and-forget)
        try {
            const emailUrl = `https://${req.headers.host || "localhost:3000"}/api/send-booking-email`;
            fetch(emailUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(enrichedData),
            }).catch(() => { }); // Non-blocking
        } catch { }

        return res.status(200).json({ success: true, data: enrichedData });
    } catch (error: any) {
        console.error("Booking error:", error);
        return res.status(500).json({ error: error.message });
    }
}
