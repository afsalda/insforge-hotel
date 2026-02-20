/**
 * slugify.js — Generate URL-safe slugs from strings.
 * @param {string} text - Text to slugify.
 * @returns {string} URL-safe slug.
 */
export function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
