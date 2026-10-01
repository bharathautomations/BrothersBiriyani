import type { Handler, HandlerEvent } from '@netlify/functions';
import { clearSessionCookie } from './utils/adminAuth';

function jsonResponse(statusCode: number, body: unknown, extraHeaders: Record<string, string> = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
    body: JSON.stringify(body),
  };
}

/** POST /api/admin-logout - clears the admin session cookie. */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }
  return jsonResponse(200, { success: true }, { 'Set-Cookie': clearSessionCookie() });
};
