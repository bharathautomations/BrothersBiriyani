import type { Handler, HandlerEvent } from '@netlify/functions';
import { getSqlClient } from './utils/db';
import { toBookingResponse } from './utils/mapBooking';
import { generateBookingReference } from './utils/reference';
import { isWithinRateLimit } from './utils/rateLimit';
import type { BookingRow } from './utils/types';
import {
  isPastDate,
  isValidDateString,
  isValidEmail,
  isValidPhone,
  isValidTimeString,
  isWithinBookingHours,
  isTimeSlotBookable,
  parseGuestCount,
  sanitizeText,
} from './utils/validation';

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

// Idempotency keys are client-generated UUIDs; this pattern just guards against garbage input.
const IDEMPOTENCY_KEY_PATTERN = /^[0-9a-fA-F-]{10,64}$/;

/**
 * POST /api/create-booking
 * Validates and sanitizes the submission server-side (never trusts the frontend alone),
 * generates a unique booking reference, and stores the booking.
 * There is deliberately no seat/capacity check anywhere in this flow.
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid request payload.' });
  }

  // Honeypot field: a hidden input real visitors never fill in. Basic bot deterrent.
  if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
    return jsonResponse(400, { success: false, error: 'Unable to process this request.' });
  }

  const customerName = sanitizeText(payload.customerName, 120);
  const customerPhone = sanitizeText(payload.customerPhone, 20);
  const customerEmailRaw = sanitizeText(payload.customerEmail, 255);
  const customerEmail = customerEmailRaw.length > 0 ? customerEmailRaw : null;
  const bookingDate = typeof payload.bookingDate === 'string' ? payload.bookingDate.trim() : '';
  const bookingTime = typeof payload.bookingTime === 'string' ? payload.bookingTime.trim() : '';
  const specialRequestRaw = sanitizeText(payload.specialRequest, 500);
  const specialRequest = specialRequestRaw.length > 0 ? specialRequestRaw : null;
  const idempotencyKey =
    typeof payload.idempotencyKey === 'string' && IDEMPOTENCY_KEY_PATTERN.test(payload.idempotencyKey.trim())
      ? payload.idempotencyKey.trim()
      : null;

  const errors: string[] = [];

  if (customerName.length < 2) errors.push('Please enter a valid name.');
  if (!isValidPhone(customerPhone)) errors.push('Please enter a valid 10-digit Indian mobile number.');
  if (customerEmail && !isValidEmail(customerEmail)) errors.push('Please enter a valid email address.');
  if (!isValidDateString(bookingDate)) {
    errors.push('Please select a valid date.');
  } else if (isPastDate(bookingDate)) {
    errors.push('Booking date cannot be in the past.');
  }
  if (!isValidTimeString(bookingTime)) {
    errors.push('Please select a valid time.');
  } else if (!isWithinBookingHours(bookingTime)) {
    errors.push('Bookings are available between 10:00 AM and 10:00 PM.');
  } else if (!isTimeSlotBookable(bookingDate, bookingTime)) {
    errors.push('Please choose a time at least 1 hour from now.');
  }

  const guestsResult = parseGuestCount(payload.numberOfGuests);
  if (!guestsResult.valid) errors.push(guestsResult.error);

  if (errors.length > 0) {
    return jsonResponse(400, { success: false, error: errors.join(' ') });
  }

  let sql;
  try {
    sql = getSqlClient();
  } catch (error) {
    console.error('create-booking: database not configured', error);
    return jsonResponse(500, { success: false, error: 'Booking service is temporarily unavailable.' });
  }

  try {
    // Idempotent replay: a resubmission of the same client request (double-click, browser
    // or network retry) returns the original booking instead of creating a duplicate row.
    if (idempotencyKey) {
      const existing = (await sql`
        SELECT
          id, booking_reference, customer_name, customer_phone, customer_email,
          TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
          TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
          number_of_guests, special_request, status, idempotency_key, created_at, updated_at
        FROM bookings WHERE idempotency_key = ${idempotencyKey} LIMIT 1
      `) as BookingRow[];
      if (existing.length > 0) {
        return jsonResponse(200, { success: true, booking: toBookingResponse(existing[0]) });
      }
    }

    const withinLimit = await isWithinRateLimit(sql, customerPhone);
    if (!withinLimit) {
      return jsonResponse(429, {
        success: false,
        error: 'Too many booking attempts from this number. Please wait a minute and try again.',
      });
    }

    const bookingReference = await generateBookingReference(sql, bookingDate);

    const inserted = (await sql`
      INSERT INTO bookings (
        booking_reference, customer_name, customer_phone, customer_email,
        booking_date, booking_time, number_of_guests, special_request,
        status, idempotency_key
      ) VALUES (
        ${bookingReference}, ${customerName}, ${customerPhone}, ${customerEmail},
        ${bookingDate}, ${bookingTime}, ${guestsResult.value}, ${specialRequest},
        'PENDING', ${idempotencyKey}
      )
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING
        id, booking_reference, customer_name, customer_phone, customer_email,
        TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
        TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
        number_of_guests, special_request, status, idempotency_key, created_at, updated_at
    `) as BookingRow[];

    if (inserted.length > 0) {
      return jsonResponse(201, { success: true, booking: toBookingResponse(inserted[0]) });
    }

    // A concurrent request with the same idempotency key won the race - return that row.
    if (idempotencyKey) {
      const existing = (await sql`
        SELECT
          id, booking_reference, customer_name, customer_phone, customer_email,
          TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
          TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
          number_of_guests, special_request, status, idempotency_key, created_at, updated_at
        FROM bookings WHERE idempotency_key = ${idempotencyKey} LIMIT 1
      `) as BookingRow[];
      if (existing.length > 0) {
        return jsonResponse(200, { success: true, booking: toBookingResponse(existing[0]) });
      }
    }

    throw new Error('Booking insert returned no rows.');
  } catch (error) {
    console.error('create-booking error', error);
    return jsonResponse(500, { success: false, error: 'Unable to create your booking. Please try again.' });
  }
};
