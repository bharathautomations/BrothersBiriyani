// Server-side validation and sanitization for booking submissions.
// The frontend performs the same checks for UX, but this is the authoritative layer -
// the frontend is never trusted on its own.

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
// Indian mobile numbers: 10 digits starting 6-9, with an optional +91/91/0 prefix.
const INDIAN_MOBILE_PATTERN = /^(?:\+91|91|0)?[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The restaurant only accepts bookings between 10:00 AM and 10:00 PM.
const BOOKING_OPEN_MINUTES = 10 * 60;
const BOOKING_CLOSE_MINUTES = 22 * 60;

// The restaurant operates on India Standard Time regardless of the server/runtime's own timezone.
const IST_OFFSET_MINUTES = 5 * 60 + 30;

function getIstNow(): Date {
  return new Date(Date.now() + IST_OFFSET_MINUTES * 60 * 1000);
}

function getIstTodayIso(): string {
  const istNow = getIstNow();
  const year = istNow.getUTCFullYear();
  const month = String(istNow.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istNow.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getIstNowMinutes(): number {
  const istNow = getIstNow();
  return istNow.getUTCHours() * 60 + istNow.getUTCMinutes();
}

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

/** Compares calendar dates only (no time-of-day / timezone drift), using India Standard Time. */
export function isPastDate(value: string): boolean {
  return value < getIstTodayIso();
}

export function isValidTimeString(value: string): boolean {
  return TIME_PATTERN.test(value);
}

/** The restaurant only accepts bookings between 10:00 AM and 10:00 PM. */
export function isWithinBookingHours(value: string): boolean {
  const [hoursStr, minutesStr] = value.split(':');
  const totalMinutes = Number(hoursStr) * 60 + Number(minutesStr);
  return totalMinutes >= BOOKING_OPEN_MINUTES && totalMinutes <= BOOKING_CLOSE_MINUTES;
}

/** When booking for today, requires the time to be at least 1 hour from the current IST time. */
export function isTimeSlotBookable(date: string, time: string): boolean {
  if (date !== getIstTodayIso()) return true;
  const [hoursStr, minutesStr] = time.split(':');
  const totalMinutes = Number(hoursStr) * 60 + Number(minutesStr);
  return totalMinutes >= getIstNowMinutes() + 60;
}

export function isValidPhone(value: string): boolean {
  const normalized = value.replace(/[\s\-()]/g, '');
  return INDIAN_MOBILE_PATTERN.test(normalized);
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
