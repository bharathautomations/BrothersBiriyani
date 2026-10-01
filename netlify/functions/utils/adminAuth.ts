// Admin session authentication: a single-admin, env-var-based credential (bcrypt hash)
// plus a signed, httpOnly cookie session. No admin users table - this is intentionally
// simple for a single restaurant's staff, per the no-new-tables requirement.

import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'bb_admin_session';
const SESSION_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured.');
  }
  return secret;
}

export function createSessionCookie(): string {
  const token = jwt.sign({ role: 'admin' }, getSessionSecret(), { expiresIn: SESSION_DURATION_SECONDS });
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const result: Record<string, string> = {};
  for (const part of header.split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (!key) continue;
    try {
      result[key] = decodeURIComponent(value);
    } catch {
      result[key] = value;
    }
  }
  return result;
}

/** Returns true only if the request carries a validly signed, unexpired admin session cookie. */
export function isAdminSessionValid(event: { headers: Record<string, string | undefined> }): boolean {
  const cookieHeader = event.headers.cookie ?? event.headers.Cookie;
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  try {
    jwt.verify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}
