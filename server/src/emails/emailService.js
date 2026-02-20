/**
 * emailService.js — Email sending service using Handlebars templates.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { transporter } from '../config/index.js';
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

        const mailOptions = {
            from: env.EMAIL_FROM,
            to,
            subject,
            html,
        };

        if (env.isDev && !env.SMTP_USER) {
            logger.debug(`[Email] Would send "${subject}" to ${to}`);
            return;
        }

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent: "${subject}" to ${to}`);
    } catch (error) {
        logger.error('Email send failed', { error: error.message, to, subject });
        // Don't throw — email failures should not block the main flow
    }
}
