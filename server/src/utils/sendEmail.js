import { BrevoClient } from '@getbrevo/brevo';
import env from '../config/env.js';

let brevoClient = null;

if (env.BREVO_API_KEY) {
    brevoClient = new BrevoClient({
        apiKey: env.BREVO_API_KEY
    });
}

/**
 * Send an email using Brevo
 * @param {string} toEmail - The recipient's email address
 * @param {string} toName - The recipient's name
 * @param {string} subject - The subject of the email
 * @param {string} htmlContent - The HTML content of the email
 */
export const sendEmail = async (toEmail, toName, subject, htmlContent) => {
    try {
        if (!brevoClient) {
            console.warn('BREVO_API_KEY is not defined. Skipping email delivery.');
            return null;
        }

        const data = await brevoClient.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: htmlContent,
            sender: {
                name: "Albaith Hotel",
                email: env.HOTEL_EMAIL
            },
            to: [
                { email: toEmail, name: toName }
            ],
            bcc: [
                { email: env.HOTEL_EMAIL, name: "Hotel Admin" }
            ]
        });

        console.log('Brevo API called successfully. Returned data: ' + JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error sending email through Brevo:', error);
        throw new Error('Failed to send email');
    }
};
