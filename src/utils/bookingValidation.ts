// Frontend-only validation helpers for the booking form UX.
// These are NOT authoritative - the Netlify Function re-validates everything server-side.

export function isValidGuestCount(value: string): boolean {
  if (!/^\d+$/.test(value.trim())) return false;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

// Indian mobile numbers: 10 digits starting 6-9, with an optional +91/91/0 prefix.
const INDIAN_MOBILE_PATTERN = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export function isValidPhoneNumber(value: string): boolean {
  const normalized = value.replace(/[\s\-()]/g, '');
  return INDIAN_MOBILE_PATTERN.test(normalized);
}

export function isValidEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isTodayOrFutureDate(value: string): boolean {
  if (!value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(`${value}T00:00:00`);
  return selected.getTime() >= today.getTime();
}

export function getLocalTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** When booking for today, requires the time to be at least 1 hour from the current local time. */
export function isTimeSlotBookable(date: string, time: string): boolean {
  if (date !== getLocalTodayIso()) return true;
  const now = new Date();
  const cutoffMinutes = now.getHours() * 60 + now.getMinutes() + 60;
  const [hoursStr, minutesStr] = time.split(':');
  const totalMinutes = Number(hoursStr) * 60 + Number(minutesStr ?? '0');
  return totalMinutes >= cutoffMinutes;
}

export function formatDisplayDate(isoDate: string): string {
  const datePart = isoDate.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDisplayTime(time: string): string {
  const timePart = time.split('T').pop() ?? time;
  const [hoursStr, minutesStr] = timePart.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr ?? '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}
