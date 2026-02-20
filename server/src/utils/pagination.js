/**
 * pagination.js — Pagination helper for InsForge queries.
 * Converts page/limit params into InsForge range() values.
 */
export function getPaginationRange(page = 1, limit = 12) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return { from, to, page, limit };
}

export function buildPaginationMeta(page, limit, totalCount) {
    const totalPages = Math.ceil(totalCount / limit);
    return {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}
