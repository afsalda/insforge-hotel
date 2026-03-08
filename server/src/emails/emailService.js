/**
 * emailService.js — Email sending service using Handlebars templates + Brevo HTTP API.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { brevoClient } from '../config/index.js';
import { env } from '../config/index.js';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pre-compile base layout
const layoutPath = path.join(__dirname, 'layouts', 'base.hbs');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');
const layoutTemplate = Handlebars.compile(layoutSource);

// Template cache
const templateCache = new Map();

function getTemplate(templateName) {
    if (templateCache.has(templateName)) return templateCache.get(templateName);

    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = Handlebars.compile(source);
    templateCache.set(templateName, template);
    return template;
}

export async function sendEmail({ to, subject, template, data }) {
    try {
        const contentTemplate = getTemplate(template);
        const content = contentTemplate(data);
        const html = layoutTemplate({
            content,
            year: new Date().getFullYear(),
        });

        // Use Resend if API key is available
        if (env.RESEND_API_KEY) {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `Al-Baith Resort <${env.FROM_EMAIL || 'noreply@albaith.in'}>`,
                    to: [to],
                    subject,
                    html: html,
                }),
            });

            if (response.ok) {
                logger.info(`Email sent via Resend: "${subject}" to ${to}`);
                return;
            } else {
                const errData = await response.json();
                logger.error('Resend email failed, trying fallback', errData);
            }
        }

        // Fallback to Brevo
        if (!brevoClient || !env.BREVO_API_KEY) {
            logger.debug(`[Email] No email service configured. Would send "${subject}" to ${to}`);
            return;
        }

        await brevoClient.transactionalEmails.sendTransacEmail({
            sender: { email: env.SENDER_EMAIL, name: 'Al-Baith Resort' },
            to: [{ email: to, name: to }],
            subject,
            htmlContent: html,
        });
        logger.info(`Email sent via Brevo: "${subject}" to ${to}`);
    } catch (error) {
        logger.error('Email send failed', { error: error.message, to, subject });
    }
}
