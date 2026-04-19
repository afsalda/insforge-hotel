/**
 * Local API Dev Server
 * 
 * Runs the Vercel serverless functions locally on port 3000
 * without needing `vercel dev` (which has issues with Windows paths containing spaces).
 * 
 * Usage: node dev-api-server.mjs
 */

import { createServer } from "http";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

// Load .env.local (same as vercel dev would)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = 3000;

// Dynamic import of TypeScript handlers via tsx
async function loadHandler(name) {
    try {
        // Use tsx to load TypeScript files
        const mod = await import(`./api/${name}.ts`);
        return mod.default;
    } catch (err) {
        console.error(`Failed to load handler ${name}:`, err.message);
        return null;
    }
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve({});
            }
        });
        req.on("error", reject);
    });
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // Parse route: /api/<handler-name>
    const match = pathname.match(/^\/api\/([a-z0-9\-]+)$/);
    if (!match) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
        return;
    }

    const handlerName = match[1];
    const handler = await loadHandler(handlerName);
    if (!handler) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Handler '${handlerName}' not found` }));
        return;
    }

    // Build req/res objects compatible with Vercel's handler signature
    const body = await parseBody(req);

    const vercelReq = {
        method: req.method,
        headers: req.headers,
        body,
        query: Object.fromEntries(url.searchParams),
        url: req.url,
    };

    const vercelRes = {
        statusCode: 200,
        _headers: {},
        setHeader(key, value) {
            this._headers[key.toLowerCase()] = value;
            return this;
        },
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this._headers["content-type"] = "application/json";
            res.writeHead(this.statusCode, this._headers);
            res.end(JSON.stringify(data));
            return this;
        },
        send(data) {
            res.writeHead(this.statusCode, this._headers);
            res.end(typeof data === "string" ? data : JSON.stringify(data));
            return this;
        },
        end(data) {
            res.writeHead(this.statusCode, this._headers);
            res.end(data || "");
            return this;
        },
    };

    try {
        await handler(vercelReq, vercelRes);
    } catch (err) {
        console.error(`Handler error [${handlerName}]:`, err);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
        }
    }
});

server.listen(PORT, () => {
    console.log(`\n  🚀 API dev server running at http://localhost:${PORT}`);
    console.log(`  📡 Proxied from Vite at http://localhost:5173/api/*`);
    console.log(`\n  Available routes:`);
    console.log(`    POST /api/create-booking`);
    console.log(`    POST /api/verify-payment`);
    console.log(`    POST /api/book-room`);
    console.log(`    POST /api/notify`);
    console.log(`\n  ENV loaded:`);
    console.log(`    RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? "✅ set" : "❌ missing"}`);
    console.log(`    RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? "✅ set" : "❌ missing"}`);
    console.log(`    WHATSAPP_ACCESS_TOKEN: ${process.env.WHATSAPP_ACCESS_TOKEN ? "✅ set" : "❌ missing"}`);
    console.log(`    WHATSAPP_PHONE_NUMBER_ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID ? "✅ set" : "❌ missing"}`);
    console.log(`    WHATSAPP_OWNER_PHONE: ${process.env.WHATSAPP_OWNER_PHONE ? "✅ set" : "❌ missing"}`);
    console.log("");
});
