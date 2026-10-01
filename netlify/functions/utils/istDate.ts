// IST (India Standard Time) date helpers shared by admin reporting endpoints.
// Kept separate from validation.ts's private helpers to avoid touching already-working code.

const IST_OFFSET_MINUTES = 5 * 60 + 30;

export function getIstNow(): Date {
  return new Date(Date.now() + IST_OFFSET_MINUTES * 60 * 1000);
}

export function toIsoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getIstTodayIso(): string {
  return toIsoDate(getIstNow());
}

export function getIstTomorrowIso(): string {
  const tomorrow = new Date(getIstNow().getTime() + 24 * 60 * 60 * 1000);
  return toIsoDate(tomorrow);
}
