import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await request.json();

    // Support both camelCase and snake_case
    const emailData = {
      guestName:   body.guestName   || body.guest_name   || 'Guest',
      guestEmail:  body.guestEmail  || body.guest_email  || '',
      guestPhone:  body.guestPhone  || body.guest_phone  || '',
      roomName:    body.roomName    || body.listing_title || body.listingTitle || 'Room',
      checkIn:     body.checkIn     || body.check_in_date || body.checkInDate || '',
      checkOut:    body.checkOut    || body.check_out_date || body.checkOutDate || '',
      totalAmount: body.totalAmount || body.total_price   || body.totalPrice || 0,
      paidAmount:  body.paidAmount  || body.deposit_amount || body.depositAmount || 0,
      bookingId:   body.bookingId   || body.booking_number || body.bookingNumber || '',
      paymentId:   body.paymentId   || body.payment_id    || '',
    };

    const {
      guestName, guestEmail, guestPhone,
      roomName, checkIn, checkOut,
      totalAmount, paidAmount, bookingId, paymentId
    } = emailData;

    const dueAmount = totalAmount - paidAmount;

    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set — skipping emails");
      return NextResponse.json({ success: false, error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    if (!guestEmail) {
      console.error("❌ Guest email is empty — skipping guest email");
      return NextResponse.json({ success: false, error: "Guest email is empty" }, { status: 400 });
    }

    const guestHtml = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #1a3c5e; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Booking Confirmed</h1>
          <p style="color: #a8c4e0; margin: 8px 0 0;">Al Baith Rest House, Ernakulam</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="color: #374151; font-size: 16px;">Dear ${guestName},</p>
          <p style="color: #374151;">Your booking has been confirmed. Here are your details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 12px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Booking ID</td>
              <td style="padding: 10px 12px; color: #111827; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Room</td>
              <td style="padding: 10px 12px; color: #111827; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${roomName}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 12px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Check-in</td>
              <td style="padding: 10px 12px; color: #111827; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${checkIn}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Check-out</td>
              <td style="padding: 10px 12px; color: #111827; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${checkOut}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 12px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Total Price</td>
              <td style="padding: 10px 12px; color: #111827; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">₹${totalAmount}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Amount Paid</td>
              <td style="padding: 10px 12px; color: #16a34a; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">₹${paidAmount}</td>
            </tr>
            <tr style="background: #fef2f2;">
              <td style="padding: 10px 12px; color: #b91c1c; font-size: 14px; font-weight: 600;">Due Amount</td>
              <td style="padding: 10px 12px; color: #b91c1c; font-size: 16px; font-weight: 700;">₹${dueAmount}</td>
            </tr>
          </table>
          <p style="color: #374151; font-size: 14px;">Payment ID: <span style="font-family: monospace;">${paymentId}</span></p>
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 16px; margin-top: 16px;">
            <p style="color: #0369a1; margin: 0; font-size: 14px;">📍 Al Baith Rest House, Ernakulam, Kerala<br>📞 24-hour front desk available for assistance</p>
          </div>
        </div>
      </div>
    `;

    const ownerHtml = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a3c5e;">New Booking Alert</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; color: #6b7280;">Guest Name</td><td style="padding: 8px; font-weight: 600;">${guestName}</td></tr>
          <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Email</td><td style="padding: 8px;">${guestEmail}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280;">Phone</td><td style="padding: 8px;">${guestPhone || 'N/A'}</td></tr>
          <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Room</td><td style="padding: 8px; font-weight: 600;">${roomName}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280;">Check-in</td><td style="padding: 8px;">${checkIn}</td></tr>
          <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Check-out</td><td style="padding: 8px;">${checkOut}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280;">Total Amount</td><td style="padding: 8px; font-weight: 600;">₹${totalAmount}</td></tr>
          <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Paid Amount</td><td style="padding: 8px; font-weight: 600; color: #16a34a;">₹${paidAmount}</td></tr>
          <tr><td style="padding: 8px; color: #b91c1c; font-weight: 600;">Due Amount</td><td style="padding: 8px; font-weight: 700; color: #b91c1c;">₹${dueAmount}</td></tr>
          <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Payment ID</td><td style="padding: 8px; font-family: monospace;">${paymentId}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280;">Booking ID</td><td style="padding: 8px; font-family: monospace;">${bookingId}</td></tr>
        </table>
      </div>
    `;

    console.log(`📧 Sending emails — Guest: ${guestEmail}, Owner: albaith.booking@gmail.com`);

    const results = await Promise.allSettled([
      resend.emails.send({
        from: 'Al Baith Rest House <bookings@albaith.in>',
        to: guestEmail,
        subject: `Booking Confirmed — ${roomName} | Al Baith Rest House`,
        html: guestHtml,
      }),
      resend.emails.send({
        from: 'Al Baith Bookings <bookings@albaith.in>',
        to: 'albaith.booking@gmail.com',
        subject: `New Booking: ${guestName} — ${roomName}`,
        html: ownerHtml,
      }),
    ]);

    // Log results for debugging
    const responseData = {
      success: results.some(r => r.status === 'fulfilled'),
      guest: results[0].status,
      owner: results[1].status,
      errors: results
        .filter(r => r.status === 'rejected')
        .map((r) => r.reason?.message || String(r.reason)),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Email handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
