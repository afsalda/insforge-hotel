import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerPhone,
            roomType,
            checkIn,
            checkOut,
            totalAmount,
            bookingId,
            dueAmount = 0
        } = body;

        console.warn("⚠️ /api/notify called — Notifications should ideally be sent by /api/verify-payment.");

        const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
        const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const OWNER_STRING = process.env.WHATSAPP_OWNER_PHONE;
        const API_URL = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

        if (!TOKEN || !PHONE_NUMBER_ID || !OWNER_STRING) {
            console.error("Missing WhatsApp env vars:", { 
                TOKEN: !!TOKEN, 
                PHONE_NUMBER_ID: !!PHONE_NUMBER_ID, 
                OWNER: !!OWNER_STRING 
            });
            return NextResponse.json(
                { error: "Server misconfiguration: WhatsApp credentials not found" },
                { status: 500 }
            );
        }

        const headers = {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        };

        // 1. Send confirmation to customer
        let customerResult = null;
        try {
            const customerMsg = await fetch(API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: customerPhone,
                    type: "template",
                    template: {
                        name: "_booking_confirmed",
                        language: { code: "en" },
                        components: [
                            {
                                type: "header",
                                parameters: [
                                    { type: "text", text: bookingId || "Confirmed" },
                                ],
                            },
                            {
                                type: "body",
                                parameters: [
                                    { type: "text", text: customerName },
                                    { type: "text", text: roomType },
                                    { type: "text", text: checkIn },
                                    { type: "text", text: checkOut },
                                    { type: "text", text: String(totalAmount) },
                                    { type: "text", text: String(dueAmount) },
                                ],
                            },
                        ],
                    },
                }),
            });
            customerResult = await customerMsg.json();
            if (!customerMsg.ok) console.error("Customer WhatsApp failed:", customerResult);
        } catch (err) {
            console.error("Customer WhatsApp error:", err.message);
            customerResult = { error: err.message };
        }

        // 2. Send alert to hotel owners
        const ownerPhones = OWNER_STRING.split(",").map(p => p.trim()).filter(p => p.length > 0);
        let ownerResults = [];
        
        for (const phone of ownerPhones) {
            try {
                const ownerMsg = await fetch(API_URL, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: phone,
                        type: "template",
                        template: {
                            name: "new_booking_alert",
                            language: { code: "en" },
                            components: [
                                {
                                    type: "body",
                                    parameters: [
                                        { type: "text", text: customerName },
                                        { type: "text", text: roomType },
                                        { type: "text", text: checkIn },
                                        { type: "text", text: checkOut },
                                    ],
                                },
                            ],
                        },
                    }),
                });
                const result = await ownerMsg.json();
                ownerResults.push({ phone, result, ok: ownerMsg.ok });
                if (!ownerMsg.ok) console.error(`Owner WhatsApp failed for ${phone}:`, result);
            } catch (err) {
                console.error(`Owner WhatsApp error for ${phone}:`, err.message);
                ownerResults.push({ phone, error: err.message, ok: false });
            }
        }

        return NextResponse.json({ 
            success: true, 
            customerResult, 
            ownerResults 
        });
    } catch (error) {
        console.error("WhatsApp notify error:", error);
        return NextResponse.json(
            { error: "Failed to send notifications", details: error.message },
            { status: 500 }
        );
    }
}
