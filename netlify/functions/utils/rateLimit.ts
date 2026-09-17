import type { NeonQueryFunction } from '@neondatabase/serverless';

const MAX_ATTEMPTS_PER_WINDOW = 5;

interface CountRow {
  recent_count: number;
}

/**
 * Basic anti-spam guard: throttles rapid repeated submissions from the same phone
 * number. This never blocks different customers booking the same date/time - only
 * an unusually high rate of attempts from one number within the last minute.
 */
export async function isWithinRateLimit(
  sql: NeonQueryFunction<false, false>,
  customerPhone: string
): Promise<boolean> {
  const rows = (await sql`
    SELECT COUNT(*)::int AS recent_count
    FROM bookings
    WHERE customer_phone = ${customerPhone}
      AND created_at > now() - interval '60 seconds'
  `) as CountRow[];

  const recentCount = Number(rows[0]?.recent_count ?? 0);
  return recentCount < MAX_ATTEMPTS_PER_WINDOW;
}
