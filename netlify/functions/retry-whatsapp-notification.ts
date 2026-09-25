import type { Handler, HandlerEvent } from '@netlify/functions';
import { getSqlClient } from './utils/db';
import type { BookingRow } from './utils/types';
import { getWhatsAppConfig } from './utils/whatsappConfig';
import { sendRestaurantBookingNotification } from './utils/whatsapp';
import { toNotificationStatus } from './utils/whatsappStatus';
import { toBookingResponse } from './utils/mapBooking';

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

const REFERENCE_PATTERN = /^BB-\d{8}-\d{4,}$/;
const RETRY_COOLDOWN_SECONDS = 60;

const BOOKING_COLUMNS = `
  id, booking_reference, customer_name, customer_phone, customer_email,
  TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
  TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
  number_of_guests, special_request, status, idempotency_key,
  customer_whatsapp_status, restaurant_whatsapp_status, whatsapp_last_error, whatsapp_sent_at,
  created_at, updated_at
`;

/**
 * POST /api/retry-whatsapp-notification
 * Body: { "bookingReference": "BB-20260920-0001" }
 * Retries only the restaurant/owner notification if it previously failed (or never ran) -
 * it never creates another booking and never re-sends if already marked SENT. Customers are
 * not messaged via WhatsApp - the on-screen booking confirmation is their confirmation.
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }

  if (!getWhatsAppConfig().enabled) {
    return jsonResponse(400, { success: false, error: 'WhatsApp notifications are disabled.' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid request payload.' });
  }

  const bookingReference = typeof payload.bookingReference === 'string' ? payload.bookingReference.trim() : '';
  if (!REFERENCE_PATTERN.test(bookingReference)) {
    return jsonResponse(400, { success: false, error: 'A valid booking reference is required.' });
  }

  let sql;
  try {
    sql = getSqlClient();
  } catch (error) {
    console.error('retry-whatsapp-notification: database not configured', error);
    return jsonResponse(500, { success: false, error: 'Booking service is temporarily unavailable.' });
  }

  try {
    const rows = (await sql(
      `SELECT ${BOOKING_COLUMNS} FROM bookings WHERE booking_reference = $1 LIMIT 1`,
      [bookingReference]
    )) as BookingRow[];

    if (rows.length === 0) {
      return jsonResponse(404, { success: false, error: 'Booking not found.' });
    }

    const row = rows[0];

    const needsRestaurantRetry = row.restaurant_whatsapp_status !== 'SENT';

    if (!needsRestaurantRetry) {
      return jsonResponse(200, {
        success: true,
        message: 'The restaurant notification was already sent - nothing to retry.',
        booking: toBookingResponse(row),
      });
    }

    if (row.whatsapp_sent_at) {
      const secondsSinceLastAttempt = (Date.now() - new Date(row.whatsapp_sent_at).getTime()) / 1000;
      if (secondsSinceLastAttempt < RETRY_COOLDOWN_SECONDS) {
        return jsonResponse(429, {
          success: false,
          error: `Please wait before retrying again (try again in ${Math.ceil(RETRY_COOLDOWN_SECONDS - secondsSinceLastAttempt)}s).`,
        });
      }
    }

    const booking = toBookingResponse(row);
    const restaurantResult = await sendRestaurantBookingNotification(booking);

    const updated = (await sql(
      `UPDATE bookings
       SET
         restaurant_whatsapp_status = $1,
         whatsapp_last_error = $2,
         whatsapp_sent_at = now()
       WHERE id = $3
       RETURNING ${BOOKING_COLUMNS}`,
      [toNotificationStatus(restaurantResult), restaurantResult.error ?? null, row.id]
    )) as BookingRow[];

    return jsonResponse(200, {
      success: restaurantResult.success,
      booking: toBookingResponse(updated[0] ?? row),
    });
  } catch (error) {
    console.error('retry-whatsapp-notification error', error);
    return jsonResponse(500, { success: false, error: 'Unable to retry the WhatsApp notification.' });
  }
};
