/**
 * formatDate.js — Format dates into human-readable strings.
 * @param {string|Date} date - Date to format.
 * @param {string} format - 'short' | 'long' | 'relative' (default: 'short').
 * @returns {string} Formatted date string.
 */
export function formatDate(date, format = 'short') {
    const d = new Date(date);

    if (format === 'long') {
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    if (format === 'relative') {
        const now = new Date();
        const diff = now - d;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // short
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
