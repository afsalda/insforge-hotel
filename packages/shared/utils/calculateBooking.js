/**
 * calculateBooking.js — Calculate booking totals.
 * @param {number} nights - Number of nights.
 * @param {number} nightlyRate - Price per night.
 * @param {number} cleaningFee - One-time cleaning fee.
 * @param {number} serviceFeePct - Service fee percentage (default: 14).
 * @param {number} taxPct - Tax percentage (default: 0).
 * @returns {object} Breakdown with subtotal, serviceFee, taxes, total.
 */
export function calculateBookingTotal(nights, nightlyRate, cleaningFee = 0, serviceFeePct = 14, taxPct = 0) {
    const subtotal = nights * nightlyRate;
    const serviceFee = Math.round((subtotal * serviceFeePct) / 100);
    const taxableAmount = subtotal + cleaningFee + serviceFee;
    const taxes = Math.round((taxableAmount * taxPct) / 100);
    const total = subtotal + cleaningFee + serviceFee + taxes;

    return {
        nights,
        nightlyRate,
        subtotal,
        cleaningFee,
        serviceFee,
        taxes,
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
