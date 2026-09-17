// Server-side validation and sanitization for booking submissions.
// The frontend performs the same checks for UX, but this is the authoritative layer -
// the frontend is never trusted on its own.

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const PHONE_PATTERN = /^[+]?[\d\s().-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Removes ASCII control characters without relying on a control-character regex class. */
function stripControlCharacters(value: string): string {
  let result = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code > 0x1f && code !== 0x7f) {
      result += char;
    }
  }
  return result;
}

/** Trims, strips angle brackets/control characters, and caps length. */
export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return stripControlCharacters(value.replace(/[<>]/g, '')).trim().slice(0, maxLength);
}

export function isValidDateString(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

/** Compares calendar dates only (no time-of-day / timezone drift). */
export function isPastDate(value: string): boolean {
  const todayIso = new Date().toISOString().split('T')[0];
  return value < todayIso;
}

export function isValidTimeString(value: string): boolean {
  return TIME_PATTERN.test(value);
}

export function isValidPhone(value: string): boolean {
  const digitCount = value.replace(/\D/g, '').length;
  return PHONE_PATTERN.test(value) && digitCount >= 7;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

// IMPORTANT: There is NO restaurant seat/capacity restriction. This upper bound exists
// purely as a technical safeguard (e.g. against integer overflow or garbage input) and
// is far beyond any realistic party size - it must never be described to guests as a
// seating limit.
const MAX_SANE_GUEST_COUNT = 100_000;

export type GuestCountResult = { valid: true; value: number } | { valid: false; error: string };

export function parseGuestCount(value: unknown): GuestCountResult {
  const numeric = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numeric) || !Number.isInteger(numeric)) {
    return { valid: false, error: 'Number of guests must be a whole number.' };
  }
  if (numeric <= 0) {
    return { valid: false, error: 'Number of guests must be greater than zero.' };
  }
  if (numeric > MAX_SANE_GUEST_COUNT) {
    return { valid: false, error: 'Please contact us directly for bookings of this size.' };
  }

  return { valid: true, value: numeric };
}
