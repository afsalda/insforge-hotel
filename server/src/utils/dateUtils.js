/**
 * dateUtils.js — Date manipulation helpers for bookings.
 */
export function daysBetween(dateA, dateB) {
    const a = new Date(dateA);
    const b = new Date(dateB);
    return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
}

export function isDateInRange(date, start, end) {
    const d = new Date(date);
    return d >= new Date(start) && d <= new Date(end);
}

export function datesOverlap(startA, endA, startB, endB) {
    return new Date(startA) < new Date(endB) && new Date(startB) < new Date(endA);
}

export function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}
