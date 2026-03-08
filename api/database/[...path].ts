/**
 * Vercel Serverless Function — InsForge Database Proxy
 * 
 * Proxies all /api/database/* requests to the InsForge backend,
 * injecting the service-level API key for write permissions.
 * 
 * This solves the issue where the anon key only allows GET requests
 * but the SDK needs POST/PATCH/DELETE for CRUD operations.
 */
export const config = {
    runtime: 'edge',
};

const INSFORGE_URL = process.env.INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY || '';

export default async function handler(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Extract the path after /api/database/
    // e.g. /api/database/records/bookings → /api/database/records/bookings
    const pathMatch = url.pathname.match(/^\/api\/database\/(.*)/);
    if (!pathMatch) {
        return new Response(JSON.stringify({ error: 'Invalid path' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const targetPath = `/api/database/${pathMatch[1]}`;
    const targetUrl = `${INSFORGE_URL}${targetPath}${url.search}`;

    // Forward headers, replacing/adding the API key for authentication
    const headers = new Headers(request.headers);

    // Use the service API key for all requests (enables write operations)
    if (INSFORGE_API_KEY) {
        headers.set('apikey', INSFORGE_API_KEY);
    }

    // Remove host header to avoid conflicts
    headers.delete('host');

    try {
        const proxyResponse = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: request.method !== 'GET' && request.method !== 'HEAD'
                ? await request.text()
                : undefined,
        });

        // Forward the response back to the client
        const responseHeaders = new Headers();
        proxyResponse.headers.forEach((value, key) => {
            // Skip hop-by-hop headers
            if (!['transfer-encoding', 'connection', 'keep-alive'].includes(key.toLowerCase())) {
                responseHeaders.set(key, value);
            }
        });

        // Ensure CORS headers
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, Prefer');

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: responseHeaders });
        }

        const responseBody = await proxyResponse.text();

        return new Response(responseBody, {
            status: proxyResponse.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new Response(JSON.stringify({ error: 'Proxy request failed', details: String(error) }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
