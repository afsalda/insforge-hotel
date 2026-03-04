import { BrevoClient } from '@getbrevo/brevo';

/**
 * Replaces the old Nodemailer transporter with the @getbrevo/brevo SDK.
 */
const brevoClient = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY || '',
});

export default brevoClient;
