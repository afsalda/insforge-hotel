/**
 * formatPrice.js — Format a numeric amount into a localized currency string.
 * @param {number} amount - The amount to format.
 * @param {string} currency - ISO 4217 currency code (default: 'USD').
 * @returns {string} Formatted price string (e.g., "$125.00").
 */
export function formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}
