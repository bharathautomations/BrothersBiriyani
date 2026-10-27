import { schedule } from '@netlify/functions';
import { getSqlClient } from './utils/db';
import { toBookingResponse } from './utils/mapBooking';
import type { BookingRow } from './utils/types';
import { getWhatsAppConfig } from './utils/whatsappConfig';
import { sendRestaurantBookingNotification } from './utils/whatsapp';
import { toNotificationStatus } from './utils/whatsappStatus';

// How many pending notifications to drain per run, and how far apart to space each
// Meta API call. 20 per minute at 300ms apart keeps steady-state throughput far below
// any WhatsApp per-number rate limit, even if every send in a run is attempted serially.
const BATCH_SIZE = 20;
const DELAY_BETWEEN_SENDS_MS = 300;

const BOOKING_COLUMNS = `
  id, booking_reference, customer_name, customer_phone, customer_email,
  TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
  TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
  number_of_guests, special_request, status, idempotency_key, created_at, updated_at
`;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Scheduled function (runs every minute) - drains the restaurant WhatsApp notification
 * backlog at a safe, throttled pace. create-booking.ts only ever marks a new booking's
 * restaurant_whatsapp_status as PENDING (its DB default); this is the only place that
 * actually sends it, one at a time, so a burst of concurrent new bookings never causes
 * a burst of simultaneous Meta API calls to the same number.
 */
export const handler = schedule('* * * * *', async () => {
  if (!getWhatsAppConfig().enabled) {
    return { statusCode: 200 };
  }

  let sql;
  try {
    sql = getSqlClient();
  } catch (error) {
    console.error('send-whatsapp-queue: database not configured', error);
    return { statusCode: 200 };
  }

  const pending = (await sql(
    `SELECT ${BOOKING_COLUMNS} FROM bookings
     WHERE restaurant_whatsapp_status = 'PENDING'
     ORDER BY created_at ASC
     LIMIT $1`,
    [BATCH_SIZE]
  )) as BookingRow[];

  let sent = 0;
  let failed = 0;

  for (const row of pending) {
    const booking = toBookingResponse(row);
    const result = await sendRestaurantBookingNotification(booking);
    if (result.success) sent += 1;
    else failed += 1;

    try {
      await sql(
        `UPDATE bookings
         SET restaurant_whatsapp_status = $1, whatsapp_last_error = $2, whatsapp_sent_at = now()
         WHERE id = $3`,
        [toNotificationStatus(result), result.error ?? null, row.id]
      );
    } catch (statusUpdateError) {
      console.error('send-whatsapp-queue: failed to persist WhatsApp status', statusUpdateError);
    }

    await sleep(DELAY_BETWEEN_SENDS_MS);
  }

  console.log(JSON.stringify({ event: 'whatsapp_queue_run', processed: pending.length, sent, failed }));
  return { statusCode: 200 };
});
