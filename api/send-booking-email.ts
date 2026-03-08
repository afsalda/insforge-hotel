import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        id,
        booking_number,
        guest_name,
        guest_email,
        guest_phone,
        listing_title,
        check_in_date,
        check_out_date,
        guests_count,
        total_price,
    } = req.body;

    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.warn("RESEND_API_KEY is not defined.");
            return res.status(500).json({ error: "Email service not configured" });
        }

        const displayId = booking_number || (id ? id.split("-")[0].toUpperCase() : "N/A");
        const fromEmail = process.env.FROM_EMAIL || "noreply@albaith.in";
        const hotelEmail = process.env.HOTEL_EMAIL || "albaith.booking@gmail.com";

        // ... (ownerHtml and customerHtml remain the same)
        const ownerHtml = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:linear-gradient(135deg,#1a3c34 0%,#2d6a4f 100%);padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:0.5px;">🔔 New Booking Alert</h1>
              <p style="color:#a7f3d0;margin:8px 0 0;font-size:14px;">Al-Baith Resort</p>
          </div>
          <div style="padding:28px 24px;">
              <p style="color:#374151;font-size:15px;margin:0 0 20px;">A new booking has been received. Here are the details:</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr style="border-bottom:1px solid #f3f4f6;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Booking Ref</td>
                      <td style="padding:12px 8px;color:#111827;font-weight:700;">${displayId}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6;background:#f9fafb;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Guest Name</td>
                      <td style="padding:12px 8px;color:#111827;">${guest_name}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Email</td>
                      <td style="padding:12px 8px;color:#111827;">${guest_email}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6;background:#f9fafb;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Phone</td>
                      <td style="padding:12px 8px;color:#111827;">${guest_phone || 'N/A'}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Room Type</td>
                      <td style="padding:12px 8px;color:#111827;">${listing_title}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6;background:#f9fafb;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Check-in</td>
                      <td style="padding:12px 8px;color:#111827;">${check_in_date}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Check-out</td>
                      <td style="padding:12px 8px;color:#111827;">${check_out_date || 'N/A'}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6;background:#f9fafb;">
                      <td style="padding:12px 8px;color:#6b7280;font-weight:600;">Guests</td>
                      <td style="padding:12px 8px;color:#111827;">${guests_count}</td>
                  </tr>
                  <tr style="background:#ecfdf5;">
                      <td style="padding:14px 8px;color:#065f46;font-weight:700;font-size:15px;">Total Price</td>
                      <td style="padding:14px 8px;color:#065f46;font-weight:700;font-size:16px;">₹${total_price}</td>
                  </tr>
              </table>
          </div>
          <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">Al-Baith Resort — Booking Management</p>
          </div>
      </div>`;

        const customerHtml = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:linear-gradient(135deg,#1a3c34 0%,#2d6a4f 100%);padding:40px 24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">✅ Booking Confirmed!</h1>
              <p style="color:#a7f3d0;margin:10px 0 0;font-size:14px;">Al-Baith Resort</p>
          </div>
          <div style="padding:28px 24px;">
              <p style="color:#374151;font-size:15px;margin:0 0 6px;">Dear <strong>${guest_name}</strong>,</p>
              <p style="color:#374151;font-size:15px;margin:0 0 24px;">Thank you for choosing <strong>Al-Baith Resort</strong>. Your booking has been confirmed successfully. Below are your reservation details:</p>
              <div style="background:#f0fdf4;border-radius:10px;padding:20px;border:1px solid #bbf7d0;">
                  <table style="width:100%;border-collapse:collapse;font-size:14px;">
                      <tr style="border-bottom:1px solid #d1fae5;">
                          <td style="padding:10px 8px;color:#6b7280;font-weight:600;">Booking Ref</td>
                          <td style="padding:10px 8px;color:#111827;font-weight:700;">${displayId}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #d1fae5;">
                          <td style="padding:10px 8px;color:#6b7280;font-weight:600;">Room Type</td>
                          <td style="padding:10px 8px;color:#111827;">${listing_title}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #d1fae5;">
                          <td style="padding:10px 8px;color:#6b7280;font-weight:600;">Check-in</td>
                          <td style="padding:10px 8px;color:#111827;">${check_in_date}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #d1fae5;">
                          <td style="padding:10px 8px;color:#6b7280;font-weight:600;">Check-out</td>
                          <td style="padding:10px 8px;color:#111827;">${check_out_date || 'N/A'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #d1fae5;">
                          <td style="padding:10px 8px;color:#6b7280;font-weight:600;">Guests</td>
                          <td style="padding:10px 8px;color:#111827;">${guests_count}</td>
                      </tr>
                      <tr>
                          <td style="padding:12px 8px;color:#065f46;font-weight:700;font-size:15px;">Total Price</td>
                          <td style="padding:12px 8px;color:#065f46;font-weight:700;font-size:16px;">₹${total_price}</td>
                      </tr>
                  </table>
              </div>
              <div style="margin-top:24px;padding:20px;background:#fffbeb;border-radius:10px;border:1px solid #fde68a;">
                  <p style="color:#92400e;font-size:14px;margin:0;line-height:1.6;">
                      📞 For any queries, reach us at <strong>${hotelEmail}</strong><br>
                      We look forward to making your stay memorable!
                  </p>
              </div>
          </div>
          <div style="background:#1a3c34;padding:20px 24px;text-align:center;">
              <p style="color:#a7f3d0;font-size:13px;margin:0;">Thank you for choosing Al-Baith Resort 🌿</p>
              <p style="color:#6b7280;font-size:11px;margin:8px 0 0;">This is an automated confirmation email. Please do not reply.</p>
          </div>
      </div>`;

        const sendEmail = (toEmail: string, subject: string, html: string) => {
            return fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: `Al-Baith Resort <${fromEmail}>`,
                    to: [toEmail],
                    subject,
                    html,
                }),
            });
        };

        await Promise.allSettled([
            sendEmail(hotelEmail, `New Booking Alert [${displayId}] – Al-Baith Resort`, ownerHtml),
            sendEmail(guest_email, `Booking Confirmed [${displayId}] – Al-Baith Resort`, customerHtml),
        ]);

        return res.status(200).json({ success: true, message: "Emails successfully sent." });
    } catch (err: any) {
        console.error("send-booking-email error:", err.message || err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
