import type { NeonQueryFunction } from '@neondatabase/serverless';

interface CounterRow {
  last_number: number;
}

/**
 * Atomically generates a per-day sequential booking reference, e.g. BB-20260920-0001.
 * The UPSERT is a single statement, so concurrent bookings for the same date each get a
 * unique, gapless-per-success sequence number without needing an explicit transaction.
 * This counter is only used for reference numbering - it does not limit or track seats.
 */
export async function generateBookingReference(
  sql: NeonQueryFunction<false, false>,
  bookingDate: string
): Promise<string> {
  const rows = (await sql`
    INSERT INTO booking_counters (counter_date, last_number)
    VALUES (${bookingDate}, 1)
    ON CONFLICT (counter_date)
    DO UPDATE SET last_number = booking_counters.last_number + 1
    RETURNING last_number
  `) as CounterRow[];

  const sequence = Number(rows[0]?.last_number ?? 1);
  const compactDate = bookingDate.replace(/-/g, '');
  return `BB-${compactDate}-${String(sequence).padStart(4, '0')}`;
}
