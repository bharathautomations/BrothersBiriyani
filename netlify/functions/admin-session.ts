import type { Handler, HandlerEvent } from '@netlify/functions';
import { isAdminSessionValid } from './utils/adminAuth';

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

/** GET /api/admin-session - used by the frontend route guard to check login state. */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { authenticated: false });
  }
  const authenticated = isAdminSessionValid(event);
  return jsonResponse(authenticated ? 200 : 401, { authenticated });
};
