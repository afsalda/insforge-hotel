/**
 * calculateBooking.js — Calculate booking totals.
 * @param {number} nights - Number of nights.
 * @param {number} nightlyRate - Price per night.
 * @param {number} cleaningFee - One-time cleaning fee.
 * @param {number} serviceFeePct - Service fee percentage (default: 14).
 * @param {number} taxPct - Tax percentage (default: 0).
 * @returns {object} Breakdown with subtotal, serviceFee, taxes, total.
 */
export function calculateBookingTotal(nights, nightlyRate) {
    const taxIncludedRate = Math.round(nightlyRate * 1.13);
    const total = taxIncludedRate * nights;

    return {
        nights,
        nightlyRate: taxIncludedRate,
        subtotal: total,
        taxes: 0,
        total,
    };
}

/**
 * Calculate the number of nights between two dates.
 * @param {string|Date} checkIn
 * @param {string|Date} checkOut
 * @returns {number}
 */
export function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
