import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Vercel Serverless Function — InsForge Database Proxy
 *
 * The client sends the original InsForge path as a query parameter `path`.
 * e.g. POST /api/insforge-proxy?path=records/bookings
 *
 * This function forwards the request to InsForge with the service API key,
 * enabling write operations that the anon key doesn't support.
 */

const INSFORGE_URL =
    process.env.INSFORGE_URL || "https://hve9xz4u.us-east.insforge.app";
const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY || "";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, apikey, Prefer, x-insforge-path"
    );

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // Get the target path from the custom header or query param
    const insforgeSubPath =
        (req.headers["x-insforge-path"] as string) ||
        (req.query.path as string);

    if (!insforgeSubPath) {
        return res.status(400).json({ error: "Missing path parameter" });
    }

    // Build the full targetURL: reconstruct query params minus our 'path' param
    const url = new URL(req.url || "/", `https://${req.headers.host}`);
    url.searchParams.delete("path");
    const queryString = url.searchParams.toString();
    const targetUrl = `${INSFORGE_URL}/api/database/${insforgeSubPath}${queryString ? `?${queryString}` : ""
        }`;

    // Build headers for InsForge
    const headers: Record<string, string> = {};

    if (req.headers["content-type"]) {
        headers["Content-Type"] = req.headers["content-type"] as string;
    }

    // Use service API key for authentication
    if (INSFORGE_API_KEY) {
        headers["apikey"] = INSFORGE_API_KEY;
    }

    // Forward Authorization
    if (req.headers["authorization"]) {
        headers["Authorization"] = req.headers["authorization"] as string;
    }

    // Forward Prefer header (PostgREST uses this)
    if (req.headers["prefer"]) {
        headers["Prefer"] = req.headers["prefer"] as string;
    }

    try {
        const fetchOptions: RequestInit = {
            method: req.method || "GET",
            headers,
        };

        if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
            fetchOptions.body =
                typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        }

        const proxyResponse = await fetch(targetUrl, fetchOptions);
        const responseText = await proxyResponse.text();

        // Forward important response headers
        const ct = proxyResponse.headers.get("content-type");
        if (ct) res.setHeader("Content-Type", ct);

        const cr = proxyResponse.headers.get("content-range");
        if (cr) res.setHeader("Content-Range", cr);

        return res.status(proxyResponse.status).send(responseText);
    } catch (error) {
        console.error("InsForge proxy error:", error);
        return res.status(502).json({
            error: "Proxy request failed",
            details: String(error),
        });
    }
}
