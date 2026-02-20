/**
 * constants/index.js — Re-export all shared constants.
 */
export * from './roles.js';
export * from './bookingStatus.js';
export * from './listingStatus.js';
export * from './propertyTypes.js';
export * from './currencies.js';

/** Platform defaults */
export const PLATFORM_DEFAULTS = {
    SERVICE_FEE_PERCENT: 14,
    PLATFORM_COMMISSION_PERCENT: 3,
    MAX_PHOTOS_PER_LISTING: 10,
    MAX_FILE_SIZE_MB: 5,
    MIN_PAYOUT_AMOUNT: 25,
    AUTO_CANCEL_HOURS: 24,
    ITEMS_PER_PAGE: 12,
};

/** Notification types */
export const NOTIFICATION_TYPES = {
    BOOKING_REQUEST: 'booking_request',
    BOOKING_CONFIRMED: 'booking_confirmed',
    BOOKING_CANCELLED: 'booking_cancelled',
    NEW_REVIEW: 'new_review',
    NEW_MESSAGE: 'new_message',
    PAYOUT_SENT: 'payout_sent',
    LISTING_APPROVED: 'listing_approved',
    SYSTEM: 'system',
};

/** Amenity categories */
export const AMENITY_CATEGORIES = {
    ESSENTIALS: 'Essentials',
    FEATURES: 'Features',
    SAFETY: 'Safety',
    LOCATION: 'Location',
    STANDOUT: 'Standout',
};
