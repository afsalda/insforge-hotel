/**
 * currencies.js — Supported currency codes and symbols.
 */
export const CURRENCIES = {
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
    INR: 'INR',
    AUD: 'AUD',
    CAD: 'CAD',
};

export const CURRENCY_SYMBOLS = {
    [CURRENCIES.USD]: '$',
    [CURRENCIES.EUR]: '€',
    [CURRENCIES.GBP]: '£',
    [CURRENCIES.INR]: '₹',
    [CURRENCIES.AUD]: 'A$',
    [CURRENCIES.CAD]: 'C$',
};

export const DEFAULT_CURRENCY = CURRENCIES.USD;
