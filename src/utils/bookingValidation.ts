// Frontend-only validation helpers for the booking form UX.
// These are NOT authoritative - the Netlify Function re-validates everything server-side.

export function isValidGuestCount(value: string): boolean {
  if (!/^\d+$/.test(value.trim())) return false;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

export function isValidPhoneNumber(value: string): boolean {
  const trimmed = value.trim();
  const digitCount = trimmed.replace(/\D/g, '').length;
  return /^[+]?[\d\s().-]{7,20}$/.test(trimmed) && digitCount >= 7;
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
