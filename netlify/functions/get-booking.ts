import type { Handler, HandlerEvent } from '@netlify/functions';
import { getSqlClient } from './utils/db';
import { toBookingResponse } from './utils/mapBooking';
import type { BookingRow } from './utils/types';

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

const REFERENCE_PATTERN = /^BB-\d{8}-\d{4,}$/;

/**
 * GET /api/get-booking?reference=BB-20260920-0001
 * Looks up a single booking by its public reference number.
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }

  const reference = (event.queryStringParameters?.reference ?? '').trim();
  if (!REFERENCE_PATTERN.test(reference)) {
    return jsonResponse(400, { success: false, error: 'A valid booking reference is required.' });
  }

  let sql;
  try {
    sql = getSqlClient();
  } catch (error) {
    console.error('get-booking: database not configured', error);
    return jsonResponse(500, { success: false, error: 'Booking service is temporarily unavailable.' });
  }

  try {
    const rows = (await sql`
      SELECT
        id, booking_reference, customer_name, customer_phone, customer_email,
        TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
        TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
        number_of_guests, special_request, status, idempotency_key, created_at, updated_at
      FROM bookings WHERE booking_reference = ${reference} LIMIT 1
    `) as BookingRow[];

    if (rows.length === 0) {
      return jsonResponse(404, { success: false, error: 'Booking not found.' });
    }

    return jsonResponse(200, { success: true, booking: toBookingResponse(rows[0]) });
  } catch (error) {
    console.error('get-booking error', error);
    return jsonResponse(500, { success: false, error: 'Unable to retrieve booking.' });
  }
};
