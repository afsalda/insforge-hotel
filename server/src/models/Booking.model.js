/**
 * Booking Model — InsForge SDK
 * Full CRUD operations for bookings table
 */
import { db } from '../config/insforge.js';
import { BrevoClient } from '@getbrevo/brevo';

const TABLE = 'bookings';

/**
 * Lazily initialised Brevo HTTP API client.
 * Created at call-time so env vars are guaranteed to be loaded.
 */
let _brevoClient = null;
function getBrevoClient() {
    if (_brevoClient) return _brevoClient;
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.warn('⚠️ BREVO_API_KEY is not defined. Email sending will be skipped.');
        return null;
    }
    _brevoClient = new BrevoClient({ apiKey });
    return _brevoClient;
}

/**
 * Sends booking notification emails (owner + customer) via Resend or Brevo.
 */
export async function sendBookingEmails(booking) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@albaith.in';
    const brevo = getBrevoClient();
    const hotelEmail = process.env.HOTEL_EMAIL || 'albaith.booking@gmail.com';
    const senderEmail = process.env.SENDER_EMAIL || 'booking@albaith.in';

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
    } = booking;

    const displayId = booking_number || id.split('-')[0].toUpperCase();

    try {
        console.log(`Preparing emails for booking ${displayId}...`);

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

        // Preference 1: Resend
        if (resendApiKey) {
            console.log('Sending emails via Resend HTTP API...');
            const results = await Promise.allSettled([
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        from: `Al-Baith Resort <${fromEmail}>`,
                        to: [hotelEmail],
                        subject: `New Booking Alert [${displayId}] – Al-Baith Resort`,
                        html: ownerHtml
                    }),
                }),
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        from: `Al-Baith Resort <${fromEmail}>`,
                        to: [guest_email],
                        subject: `Booking Confirmed [${displayId}] – Al-Baith Resort`,
                        html: customerHtml
                    }),
                })
            ]);
            results.forEach((r, idx) => {
                const label = idx === 0 ? 'Owner' : 'Customer';
                if (r.status === 'fulfilled' && r.value.ok) {
                    console.log(`${label} email sent successfully via Resend ✅`);
                } else {
                    console.error(`${label} email failed via Resend:`, r.reason || 'Status not OK');
                }
            });
            return;
        }

        // Preference 2: Brevo
        if (brevo) {
            console.log('Sending emails via Brevo HTTP API...');
            const results = await Promise.allSettled([
                brevo.transactionalEmails.sendTransacEmail({
                    subject: `New Booking Alert [${displayId}] – Al-Baith Resort`,
                    htmlContent: ownerHtml,
                    sender: { email: senderEmail, name: 'Al-Baith Resort' },
                    to: [{ email: hotelEmail, name: 'Owner' }],
                }),
                brevo.transactionalEmails.sendTransacEmail({
                    subject: `Booking Confirmed [${displayId}] – Al-Baith Resort`,
                    htmlContent: customerHtml,
                    sender: { email: senderEmail, name: 'Al-Baith Resort' },
                    to: [{ email: guest_email, name: guest_name }],
                })
            ]);

            results.forEach((r, idx) => {
                const label = idx === 0 ? 'Owner' : 'Customer';
                if (r.status === 'fulfilled') {
                    console.log(`${label} email sent successfully via Brevo ✅`);
                } else {
                    console.error(`${label} email failed via Brevo:`, r.reason?.message || r.reason);
                }
            });
        }
    } catch (error) {
        console.error('Email sending failed:', error.message || error);
    }
}


// CREATE
export const createBooking = async (bookingData) => {
    // Generate a standard, human-readable booking reference (Used for display/emails)
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingNumber = `ALB-${year}-${randomPart}`;

    let enrichedData;

    try {
        const { data, error } = await db
            .from(TABLE)
            .insert([{
                guest_name: bookingData.guestName,
                guest_email: bookingData.guestEmail,
                guest_phone: bookingData.guestPhone || '',
                room_id: bookingData.roomId || 'standard',
                check_in_date: bookingData.checkInDate,
                check_out_date: bookingData.checkOutDate || null,
                listing_title: bookingData.listingTitle || '',
                guests_count: bookingData.guestsCount || 1,
                total_price: bookingData.totalPrice || 0,
                status: bookingData.status || 'confirmed',
                total_nights: bookingData.totalNights || 1,
                extra_bed: bookingData.extraBed || false,
                special_requests: bookingData.specialRequests || '',
            }])
            .select()
            .single();

        if (error) throw error;

        // Attach the booking number for the emails
        enrichedData = { ...data, booking_number: bookingNumber };

        // Send confirmation emails in background
        sendBookingEmails(enrichedData);

        return enrichedData;
    } catch (error) {
        console.error('Error creating booking:', error.message);
        throw error;
    }
};

// READ ALL
export const getAllBookings = async () => {
    try {
        const { data, error } = await db
            .from(TABLE)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        throw error;
    }
};

// UPDATE
export const updateBooking = async (id, updates) => {
    try {
        const { data, error } = await db
            .from(TABLE)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating booking:', error.message);
        throw error;
    }
};

// DELETE
export const deleteBooking = async (id) => {
    try {
        const { error } = await db
            .from(TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting booking:', error.message);
        throw error;
    }
};
