/**
 * bookingStatus.js — Booking lifecycle status constants.
 */
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    REFUNDED: 'refunded',
};

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
    FAILED: 'failed',
};

export const PAYOUT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
};
