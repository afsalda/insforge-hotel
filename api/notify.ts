import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Vercel Serverless Function — WhatsApp Notify
 * 
 * Sends booking confirmation to the customer and an alert to the hotel owner via WhatsApp Meta API.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    customerName,
    customerPhone,
    roomType,
    checkIn,
    checkOut,
    totalAmount,
    bookingId,
  } = req.body;

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const OWNER = process.env.OWNER_WHATSAPP;
  const API_URL = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

  if (!TOKEN || !PHONE_NUMBER_ID || !OWNER) {
    console.error("Missing WhatsApp env vars:", { 
      TOKEN: !!TOKEN, 
      PHONE_NUMBER_ID: !!PHONE_NUMBER_ID, 
      OWNER: !!OWNER 
    });
    return res.status(500).json({ error: "Server misconfiguration: WhatsApp credentials not found" });
  }

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. Send confirmation to customer
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
              type: "body",
              parameters: [
                { type: "text", text: customerName },
                { type: "text", text: roomType },
                { type: "text", text: checkIn },
                { type: "text", text: checkOut },
                { type: "text", text: String(totalAmount) },
              ],
            },
          ],
        },
      }),
    });

    // 2. Send alert to hotel owner
    const ownerMsg = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: OWNER,
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

    const customerResult = await customerMsg.json();
    const ownerResult = await ownerMsg.json();

    // Log errors from Meta without crashing
    if (!customerMsg.ok) {
      console.error("Customer WhatsApp failed:", customerResult);
    }
    if (!ownerMsg.ok) {
      console.error("Owner WhatsApp failed:", ownerResult);
    }

    return res.status(200).json({ 
      success: true, 
      customerResult, 
      ownerResult 
    });
  } catch (err: any) {
    console.error("WhatsApp notify error:", err);
    return res.status(500).json({ error: "Failed to send notifications", details: err.message });
  }
}
