/**
 * roles.js — User role constants used across client and server.
 */
export const USER_ROLES = {
    GUEST: 'guest',
    HOST: 'host',
    ADMIN: 'admin',
};

export const ROLE_LABELS = {
    [USER_ROLES.GUEST]: 'Guest',
    [USER_ROLES.HOST]: 'Host',
    [USER_ROLES.ADMIN]: 'Admin',
};
