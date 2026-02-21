import { Router } from 'express';
import { sendEmail } from '../utils/sendEmail.js';

const router = Router();

/**
 * POST /api/send-confirmation
 * Body parameters: guestName, guestEmail, roomType, checkIn, checkOut, totalPrice
 */
router.post('/send-confirmation', async (req, res) => {
    try {
        const { guestName, guestEmail, roomType, checkIn, checkOut, totalPrice } = req.body;

        if (!guestName || !guestEmail || !roomType || !checkIn || !checkOut || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Missing required booking details.'
            });
        }

        const subject = 'Your Booking Confirmation - Albaith Hotel';

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                    <h1 style="color: #2c3e50; margin: 0;">Albaith Hotel</h1>
                    <p style="color: #7f8c8d; margin: 5px 0 0 0;">Booking Confirmation</p>
                </div>
                
                <p>Dear <strong>${guestName}</strong>,</p>
                <p>Thank you for choosing Albaith Hotel! Your booking has been successfully confirmed. Below are the details of your reservation:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9; width: 40%;">Room Type</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${roomType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Check-in Date</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${new Date(checkIn).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Check-out Date</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${new Date(checkOut).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Total Price</td>
                        <td style="padding: 10px; border: 1px solid #ddd; color: #27ae60; font-weight: bold;">$${totalPrice}</td>
                    </tr>
                </table>
                
                <p>If you have any questions or need to modify your reservation, please contact us at <a href="mailto:albaith.booking@gmail.com" style="color: #3498db; text-decoration: none;">albaith.booking@gmail.com</a>.</p>
                
                <p style="margin-top: 30px;">We look forward to hosting you!</p>
                
                <div style="text-align: center; margin-top: 40px; font-size: 0.9em; color: #95a5a6; border-top: 1px solid #eee; padding-top: 15px;">
                    <p style="margin: 0;">Albaith Hotel, 123 Luxury Avenue, Metropolis</p>
                    <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Albaith Hotel. All rights reserved.</p>
                </div>
            </div>
        `;

        await sendEmail(guestEmail, guestName, subject, htmlContent);

        res.status(200).json({
            success: true,
            message: 'Confirmation email sent successfully.'
        });

    } catch (error) {
        console.error('Email route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send confirmation email. Please try again later.'
        });
    }
});

export default router;
