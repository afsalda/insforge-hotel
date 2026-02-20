/**
 * filterBuilder.js — Builds InsForge query filters from request query params.
 */
export function applyFilters(query, filters) {
    if (filters.eq) {
        for (const [key, value] of Object.entries(filters.eq)) {
            if (value !== undefined && value !== '') query = query.eq(key, value);
        }
    }
    if (filters.ilike) {
        for (const [key, value] of Object.entries(filters.ilike)) {
            if (value) query = query.ilike(key, `%${value}%`);
        }
    }
    if (filters.gte) {
        for (const [key, value] of Object.entries(filters.gte)) {
            if (value !== undefined) query = query.gte(key, value);
        }
    }
    if (filters.lte) {
        for (const [key, value] of Object.entries(filters.lte)) {
            if (value !== undefined) query = query.lte(key, value);
        }
    }
    if (filters.in) {
        for (const [key, value] of Object.entries(filters.in)) {
            if (value && value.length) query = query.in(key, value);
        }
    }
    return query;
}
