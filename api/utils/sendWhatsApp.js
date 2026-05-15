/**
 * sendWhatsApp — Reusable WhatsApp Cloud API sender
 *
 * Sends a WhatsApp template message via Meta Business API.
 *
 * @param {string} to — Recipient phone in 91XXXXXXXXXX format (no +)
 * @param {string} templateName — Approved template name (e.g. "_booking_confirmed")
 * @param {Array} bodyVariables — Array of text variables for the BODY component
 * @param {Array} [headerVariables] — Array of text variables for the HEADER component (if template has a header)
 * @returns {Promise<object>} — WhatsApp API response
 */
export async function sendWhatsApp(to, templateName, bodyVariables = [], headerVariables = []) {
    const phoneNumberId = (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim();
    const accessToken = (process.env.WHATSAPP_ACCESS_TOKEN || '').trim();

    if (!phoneNumberId || !accessToken) {
        console.warn("⚠️ WhatsApp credentials not configured — skipping message");
        return { skipped: true, reason: "Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN" };
    }

    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    // Build template components array
    const components = [];

    // Add HEADER parameters if provided
    if (headerVariables.length > 0) {
        components.push({
            type: "header",
            parameters: headerVariables.map(v => ({
                type: "text",
                text: String(v)
            }))
        });
    }

    // Add BODY parameters
    if (bodyVariables.length > 0) {
        components.push({
            type: "body",
            parameters: bodyVariables.map(v => ({
                type: "text",
                text: String(v)
            }))
        });
    }

    const body = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
            name: templateName,
            language: { code: "en" },
            components,
        },
    };

    console.log(`📤 Sending WhatsApp [${templateName}] to ${to}...`);
    console.log('   Components:', JSON.stringify(components));

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('WhatsApp response:', JSON.stringify(data));

    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }

    console.log(`✅ WhatsApp sent to ${to} [${templateName}]`);
    return data;
}
