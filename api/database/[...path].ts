import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Vercel Serverless Function — InsForge Database Proxy
 *
 * Proxies all /api/database/* requests to the InsForge backend,
 * injecting the service-level API key for write permissions.
 *
 * This solves the issue where the anon key only allows GET requests
 * but the SDK needs POST/PATCH/DELETE for CRUD operations.
 */

const INSFORGE_URL =
    process.env.INSFORGE_URL || "https://hve9xz4u.us-east.insforge.app";
const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY || "";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Handle CORS preflight
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, apikey, Prefer"
    );

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // Extract the path after /api/database/
    const fullPath = req.url || "";
    const pathMatch = fullPath.match(/^\/api\/database\/(.*)/);
    if (!pathMatch) {
        return res.status(400).json({ error: "Invalid path" });
    }

    const subPath = pathMatch[1]; // e.g. "records/bookings?select=*"
    const targetUrl = `${INSFORGE_URL}/api/database/${subPath}`;

    // Build headers
    const headers: Record<string, string> = {
        "Content-Type": req.headers["content-type"] || "application/json",
    };

    // Use service API key for authentication (enables write operations)
    if (INSFORGE_API_KEY) {
        headers["apikey"] = INSFORGE_API_KEY;
    }

    // Forward the Authorization header from the client
    if (req.headers["authorization"]) {
        headers["Authorization"] = req.headers["authorization"] as string;
    }

    // Forward the Prefer header (used by PostgREST for return=representation)
    if (req.headers["prefer"]) {
        headers["Prefer"] = req.headers["prefer"] as string;
    }

    try {
        const fetchOptions: RequestInit = {
            method: req.method || "GET",
            headers,
        };

        // Forward body for non-GET/HEAD requests
        if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
            fetchOptions.body =
                typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        }

        const proxyResponse = await fetch(targetUrl, fetchOptions);
        const responseText = await proxyResponse.text();

        // Forward response headers
        const contentType = proxyResponse.headers.get("content-type");
        if (contentType) {
            res.setHeader("Content-Type", contentType);
        }

        // Forward content-range for pagination
        const contentRange = proxyResponse.headers.get("content-range");
        if (contentRange) {
            res.setHeader("Content-Range", contentRange);
        }

        return res.status(proxyResponse.status).send(responseText);
    } catch (error) {
        console.error("InsForge proxy error:", error);
        return res.status(502).json({
            error: "Proxy request failed",
            details: String(error),
        });
    }
}
