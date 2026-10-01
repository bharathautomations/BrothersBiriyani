import type { Handler, HandlerEvent } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { createSessionCookie } from './utils/adminAuth';

function jsonResponse(statusCode: number, body: unknown, extraHeaders: Record<string, string> = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
    body: JSON.stringify(body),
  };
}

/**
 * POST /api/admin-login
 * Body: { "password": "..." }
 * Single-admin credential check: the plaintext password is compared against a bcrypt hash
 * stored only in the ADMIN_PASSWORD_HASH environment variable - never in source or the DB.
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid request payload.' });
  }

  const password = typeof payload.password === 'string' ? payload.password : '';
  if (!password) {
    return jsonResponse(400, { success: false, error: 'Password is required.' });
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    console.error('admin-login: ADMIN_PASSWORD_HASH is not configured');
    return jsonResponse(500, { success: false, error: 'Admin login is not configured.' });
  }

  try {
    const isValid = await bcrypt.compare(password, passwordHash);
    if (!isValid) {
      return jsonResponse(401, { success: false, error: 'Invalid credentials.' });
    }

    return jsonResponse(200, { success: true }, { 'Set-Cookie': createSessionCookie() });
  } catch (error) {
    console.error('admin-login error', error);
    return jsonResponse(500, { success: false, error: 'Unable to process login.' });
  }
};
