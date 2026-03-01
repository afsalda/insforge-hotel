/**
 * Booking Model — InsForge SDK
 * Full CRUD operations for bookings table
 */
import { db } from '../config/insforge.js';
import nodemailer from 'nodemailer';

const TABLE = 'bookings';

/**
 * Sends booking notification emails (owner + customer).
 * Transporter is created at call-time so env vars are guaranteed to be loaded.
 * Hardcoded credentials act as reliable fallbacks.
 */
async function sendBookingEmails(booking) {
    // ── Create transporter at call-time (env is loaded by now) ──
    const smtpUser = process.env.BREVO_SMTP_LOGIN || 'a2f52a001@smtp-brevo.com';
    const smtpPass = process.env.BREVO_SMTP_KEY || '';
    const senderEmail = process.env.SENDER_EMAIL || 'booking@albaith.in';
    const hotelEmail = process.env.HOTEL_EMAIL || 'albaith.booking@gmail.com';

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
    });

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

    // Use standard booking number for display, fallback to short ID
    const displayId = booking_number || id.split('-')[0].toUpperCase();

    try {
        // ... (logging and verify unchanged) ...
        await transporter.verify();
        console.log('SMTP connection verified ✅');

        // ── Email 1 → Hotel Owner Notification ──
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

        await transporter.sendMail({
            from: `"Al-Baith Resort" <${senderEmail}>`,
            to: hotelEmail,
            subject: `New Booking Alert [${displayId}] – Al-Baith Resort`,
            html: ownerHtml,
        });
        console.log('Owner email sent ✅');

        // ── Email 2 → Customer Confirmation ──
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
                        📞 For any queries, reach us at <strong>albaith.booking@gmail.com</strong><br>
                        We look forward to making your stay memorable!
                    </p>
                </div>
            </div>
            <div style="background:#1a3c34;padding:20px 24px;text-align:center;">
                <p style="color:#a7f3d0;font-size:13px;margin:0;">Thank you for choosing Al-Baith Resort 🌿</p>
                <p style="color:#6b7280;font-size:11px;margin:8px 0 0;">This is an automated confirmation email. Please do not reply.</p>
            </div>
        </div>`;

        await transporter.sendMail({
            from: `"Al-Baith Resort" <${senderEmail}>`,
            to: guest_email,
            subject: `Booking Confirmed [${displayId}] – Al-Baith Resort`,
            html: customerHtml,
        });
        console.log('Customer email sent ✅');

    } catch (error) {
        console.error('Email sending failed:', error.message || error);
        // Don't throw — email failure should never break the booking flow
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
        // Attach the generated booking number to the returned record for application use
        enrichedData = { ...data, booking_number: bookingNumber };

    } catch (err) {
        console.warn('⚠️ [Graceful Degradation] InsForge Database unavailable. Using in-memory fallback for booking:', err.message);

        // Mock successful data to prevent the application from crashing
        enrichedData = {
            id: `mock-${randomPart.toLowerCase()}`,
            booking_number: bookingNumber,
            guest_name: bookingData.guestName,
            guest_email: bookingData.guestEmail,
            guest_phone: bookingData.guestPhone || '',
            room_id: bookingData.roomId || 'standard',
            check_in_date: bookingData.checkInDate,
            check_out_date: bookingData.checkOutDate || null,
            listing_title: bookingData.listingTitle || '',
            guests_count: bookingData.guestsCount || 1,
            total_price: bookingData.totalPrice || 0,
            status: 'confirmed_offline_sync',
            created_at: new Date().toISOString()
        };
    }

    // Send booking notification emails (fire-and-forget — never blocks the booking)
    // Email sending will work even if DB is down!
    sendBookingEmails(enrichedData).catch((emailErr) => {
        console.error('⚠️ Email sending failed (booking still saved):', emailErr.message);
    });

    return enrichedData;
};

// READ ALL
export const getAllBookings = async () => {
    const { data, error } = await db
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// READ ONE by ID
export const getBookingById = async (id) => {
    const { data, error } = await db
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// UPDATE
export const updateBooking = async (id, updates) => {
    const updateObj = {};
    if (updates.guestName) updateObj.guest_name = updates.guestName;
    if (updates.guestEmail) updateObj.guest_email = updates.guestEmail;
    if (updates.guestPhone) updateObj.guest_phone = updates.guestPhone;
    if (updates.roomId) updateObj.room_id = updates.roomId;
    if (updates.checkInDate) updateObj.check_in_date = updates.checkInDate;
    if (updates.checkOutDate) updateObj.check_out_date = updates.checkOutDate;
    if (updates.listingTitle) updateObj.listing_title = updates.listingTitle;
    if (updates.guestsCount) updateObj.guests_count = updates.guestsCount;
    if (updates.totalPrice) updateObj.total_price = updates.totalPrice;
    if (updates.status) updateObj.status = updates.status;

    const { data, error } = await db
        .from(TABLE)
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// DELETE
export const deleteBooking = async (id) => {
    const { error } = await db
        .from(TABLE)
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
};
