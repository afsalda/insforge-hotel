import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Route Handler — InsForge Database Proxy
 *
 * Forwards requests to InsForge with the service API key.
 * Supports GET, POST, PUT, PATCH, DELETE.
 */

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_API_KEY = process.env.INSFORGE_SERVICE_KEY || process.env.INSFORGE_API_KEY || '';

async function proxyHandler(request, { params }) {
  const url = new URL(request.url);

  // Get the target path from x-insforge-path header or path query param
  const insforgeSubPath =
    request.headers.get('x-insforge-path') ||
    url.searchParams.get('path');

  if (!insforgeSubPath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  url.searchParams.delete('path');
  const queryString = url.searchParams.toString();
  const targetUrl = `${INSFORGE_URL}/api/database/${insforgeSubPath}${queryString ? `?${queryString}` : ''}`;

  // Build headers for InsForge
  const headers = {};

  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;

  if (INSFORGE_API_KEY) headers['apikey'] = INSFORGE_API_KEY;

  const authorization = request.headers.get('authorization');
  if (authorization) headers['Authorization'] = authorization;

  const prefer = request.headers.get('prefer');
  if (prefer) headers['Prefer'] = prefer;

  try {
    const fetchOptions = {
      method: request.method,
      headers,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const body = await request.text();
      if (body) fetchOptions.body = body;
    }

    const proxyResponse = await fetch(targetUrl, fetchOptions);
    const responseText = await proxyResponse.text();

    const responseHeaders = new Headers();
    const ct = proxyResponse.headers.get('content-type');
    if (ct) responseHeaders.set('Content-Type', ct);

    const cr = proxyResponse.headers.get('content-range');
    if (cr) responseHeaders.set('Content-Range', cr);

    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(responseText, {
      status: proxyResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('InsForge proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: String(error) },
      { status: 502 }
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, Prefer, x-insforge-path',
    },
  });
}
