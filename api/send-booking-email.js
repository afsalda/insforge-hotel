import { sendBookingEmails } from '../server/src/models/Booking.model.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await sendBookingEmails(req.body);
            res.status(200).json({ success: true, message: 'Emails sent successfully.' });
        } catch (error) {
            console.error('send-booking-email error:', error.message || error);
            res.status(500).json({ success: false, message: 'Failed to send booking emails.' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
