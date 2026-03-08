/**
 * sendEmail.js — Generic email sending utility using Brevo HTTP API.
 * Uses @getbrevo/brevo v4 SDK (BrevoClient).
 */
import { BrevoClient } from '@getbrevo/brevo';
import env from '../config/env.js';

let brevoClient = null;

if (env.BREVO_API_KEY) {
    brevoClient = new BrevoClient({
        apiKey: env.BREVO_API_KEY,
    });
}

/**
 * Send an email using Brevo HTTP API
 * @param {string} toEmail - The recipient's email address
 * @param {string} toName - The recipient's name
 * @param {string} subject - The subject of the email
 * @param {string} htmlContent - The HTML content of the email
 */
export const sendEmail = async (toEmail, toName, subject, htmlContent) => {
    try {
        // Preference 1: Resend
        if (env.RESEND_API_KEY) {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `Al-Baith Resort <${env.FROM_EMAIL || 'noreply@albaith.in'}>`,
                    to: [toEmail],
                    subject,
                    html: htmlContent,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Email sent via Resend:', data.id);
                return data;
            } else {
                const errData = await response.json();
                console.error('Resend API error, trying fallback:', errData);
            }
        }

        // Preference 2: Brevo
        if (!brevoClient) {
            console.warn('No email service configured (Resend or Brevo). Skipping email delivery.');
            return null;
        }

        const data = await brevoClient.transactionalEmails.sendTransacEmail({
            subject,
            htmlContent,
            sender: {
                name: 'Al-Baith Resort',
                email: env.SENDER_EMAIL,
            },
            to: [
                { email: toEmail, name: toName },
            ],
        });

        console.log('Brevo API called successfully. Returned data:', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        // We generally don't want to throw and block the process for an email failure
        return null;
    }
};
