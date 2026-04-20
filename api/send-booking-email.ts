import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmails(bookingData: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  bookingId: string;
  paymentId: string;
}) {
  const {
    guestName, guestEmail, guestPhone,
    roomName, checkIn, checkOut,
    totalAmount, bookingId, paymentId
  } = bookingData;

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
            <td style="padding: 10px 12px; color: #6b7280; font-size: 14px;">Amount Paid</td>
            <td style="padding: 10px 12px; color: #111827; font-size: 14px; font-weight: 600;">₹${totalAmount}</td>
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
        <tr><td style="padding: 8px; color: #6b7280;">Phone</td><td style="padding: 8px;">${guestPhone}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Room</td><td style="padding: 8px; font-weight: 600;">${roomName}</td></tr>
        <tr><td style="padding: 8px; color: #6b7280;">Check-in</td><td style="padding: 8px;">${checkIn}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Check-out</td><td style="padding: 8px;">${checkOut}</td></tr>
        <tr><td style="padding: 8px; color: #6b7280;">Amount</td><td style="padding: 8px; font-weight: 600;">₹${totalAmount}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding: 8px; color: #6b7280;">Payment ID</td><td style="padding: 8px; font-family: monospace;">${paymentId}</td></tr>
        <tr><td style="padding: 8px; color: #6b7280;">Booking ID</td><td style="padding: 8px; font-family: monospace;">${bookingId}</td></tr>
      </table>
    </div>
  `;

  await Promise.all([
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
}
