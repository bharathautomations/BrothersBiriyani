import type { Handler, HandlerEvent } from '@netlify/functions';
import { getSqlClient } from './utils/db';
import { isAdminSessionValid } from './utils/adminAuth';
import { toAdminBookingResponse } from './utils/adminMapBooking';
import { toBookingResponse } from './utils/mapBooking';
import type { BookingRow, BookingStatus } from './utils/types';
import { getWhatsAppConfig } from './utils/whatsappConfig';
import { sendCustomerStatusUpdateNotification } from './utils/whatsapp';
import { toNotificationStatus } from './utils/whatsappStatus';

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

const REFERENCE_PATTERN = /^BB-\d{8}-\d{4,}$/;
const VALID_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED'];
// Only these transitions notify the customer - PENDING is an internal/initial state, not an event worth messaging about.
const NOTIFIABLE_STATUSES: BookingStatus[] = ['CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED'];

const ADMIN_BOOKING_COLUMNS = `
  id, booking_reference, customer_name, customer_phone, customer_email,
  TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
  TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
  number_of_guests, special_request, status, idempotency_key,
  customer_whatsapp_status, restaurant_whatsapp_status, whatsapp_last_error, whatsapp_sent_at,
  created_at, updated_at
`;

/**
 * POST /api/admin-update-booking-status
 * Body: { "bookingReference": "BB-...", "status": "CONFIRMED" }
 * Never rejects a booking because of guest count - this only ever changes `status`.
 * Sends a WhatsApp status-change notification to the customer only when the status
 * actually changes, so re-confirming an already-confirmed booking never double-sends.
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }

  if (!isAdminSessionValid(event)) {
    return jsonResponse(401, { success: false, error: 'Unauthorized.' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid request payload.' });
  }

  const bookingReference = typeof payload.bookingReference === 'string' ? payload.bookingReference.trim() : '';
  const newStatus = typeof payload.status === 'string' ? payload.status.trim().toUpperCase() : '';

  if (!REFERENCE_PATTERN.test(bookingReference)) {
    return jsonResponse(400, { success: false, error: 'A valid booking reference is required.' });
  }
  if (!VALID_STATUSES.includes(newStatus as BookingStatus)) {
    return jsonResponse(400, { success: false, error: 'Invalid status value.' });
  }

  let sql;
  try {
    sql = getSqlClient();
  } catch (error) {
    console.error('admin-update-booking-status: database not configured', error);
    return jsonResponse(500, { success: false, error: 'Service is temporarily unavailable.' });
  }

  try {
    const existingRows = (await sql(
      `SELECT ${ADMIN_BOOKING_COLUMNS} FROM bookings WHERE booking_reference = $1 LIMIT 1`,
      [bookingReference]
    )) as BookingRow[];

    if (existingRows.length === 0) {
      return jsonResponse(404, { success: false, error: 'Booking not found.' });
    }

    const existing = existingRows[0];

    // Status unchanged - no-op, and crucially no duplicate WhatsApp notification.
    if (existing.status === newStatus) {
      return jsonResponse(200, { success: true, booking: toAdminBookingResponse(existing), unchanged: true });
    }

    const updatedRows = (await sql(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING ${ADMIN_BOOKING_COLUMNS}`,
      [newStatus, existing.id]
    )) as BookingRow[];
    const updated = updatedRows[0];

    if (getWhatsAppConfig().enabled && NOTIFIABLE_STATUSES.includes(newStatus as BookingStatus)) {
      const booking = toBookingResponse(updated);
      const result = await sendCustomerStatusUpdateNotification(booking, newStatus as BookingStatus);

      try {
        await sql(
          `UPDATE bookings
           SET customer_whatsapp_status = $1, whatsapp_last_error = $2, whatsapp_sent_at = now()
           WHERE id = $3`,
          [toNotificationStatus(result), result.error ?? null, existing.id]
        );
        updated.customer_whatsapp_status = toNotificationStatus(result);
        updated.whatsapp_last_error = result.error ?? null;
      } catch (statusUpdateError) {
        console.error('admin-update-booking-status: failed to persist WhatsApp status', statusUpdateError);
      }
    }

    return jsonResponse(200, { success: true, booking: toAdminBookingResponse(updated) });
  } catch (error) {
    console.error('admin-update-booking-status error', error);
    return jsonResponse(500, { success: false, error: 'Unable to update booking status.' });
  }
};
