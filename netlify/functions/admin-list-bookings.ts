import type { Handler, HandlerEvent } from '@netlify/functions';
import { getSqlClient } from './utils/db';
import { isAdminSessionValid } from './utils/adminAuth';
import { getIstTodayIso, getIstTomorrowIso } from './utils/istDate';
import { toAdminBookingResponse } from './utils/adminMapBooking';
import type { BookingRow, BookingStatus } from './utils/types';

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

const VALID_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED'];
const SORT_COLUMNS: Record<string, string> = {
  date: 'booking_date',
  time: 'booking_time',
  guests: 'number_of_guests',
  created: 'created_at',
};
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

const ADMIN_BOOKING_COLUMNS = `
  id, booking_reference, customer_name, customer_phone, customer_email,
  TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
  TO_CHAR(booking_time, 'HH24:MI') AS booking_time,
  number_of_guests, special_request, status, idempotency_key,
  customer_whatsapp_status, restaurant_whatsapp_status, whatsapp_last_error, whatsapp_sent_at,
  created_at, updated_at
`;

/**
 * GET /api/admin-list-bookings
 * Query params: view (today|tomorrow|upcoming), date (YYYY-MM-DD, used when view is omitted
 * or set to "custom"), status, customerName, phone, sortBy (date|time|guests|created),
 * sortDir (asc|desc), page, limit.
 * All filter values are parameterized - the only user-influenced raw SQL text is the sort
 * column/direction, both resolved through a fixed allow-list, never interpolated directly.
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }

  if (!isAdminSessionValid(event)) {
    return jsonResponse(401, { success: false, error: 'Unauthorized.' });
  }

  const query = event.queryStringParameters ?? {};
  const view = query.view ?? '';
  const customDate = query.date ?? '';
  const time = query.time ?? '';
  const status = (query.status ?? '').toUpperCase();
  const customerName = query.customerName ?? '';
  const phone = query.phone ?? '';
  const sortBy = SORT_COLUMNS[query.sortBy ?? ''] ?? 'booking_date';
  const sortDir = query.sortDir === 'desc' ? 'DESC' : 'ASC';
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const offset = (page - 1) * limit;

  if (status && !VALID_STATUSES.includes(status as BookingStatus)) {
    return jsonResponse(400, { success: false, error: 'Invalid status filter.' });
  }
  if (customDate && !DATE_PATTERN.test(customDate)) {
    return jsonResponse(400, { success: false, error: 'Invalid date filter.' });
  }
  if (time && !TIME_PATTERN.test(time)) {
    return jsonResponse(400, { success: false, error: 'Invalid time filter.' });
  }

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (view === 'today') {
    params.push(getIstTodayIso());
    conditions.push(`booking_date = $${params.length}`);
  } else if (view === 'tomorrow') {
    params.push(getIstTomorrowIso());
    conditions.push(`booking_date = $${params.length}`);
  } else if (view === 'upcoming') {
    params.push(getIstTodayIso());
    conditions.push(`booking_date >= $${params.length}`);
  } else if (customDate) {
    params.push(customDate);
    conditions.push(`booking_date = $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (time) {
    params.push(time);
    conditions.push(`booking_time = $${params.length}`);
  }
  if (customerName) {
    params.push(`%${customerName}%`);
    conditions.push(`customer_name ILIKE $${params.length}`);
  }
  if (phone) {
    params.push(`%${phone}%`);
    conditions.push(`customer_phone ILIKE $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let sql;
  try {
    sql = getSqlClient();
  } catch (error) {
    console.error('admin-list-bookings: database not configured', error);
    return jsonResponse(500, { success: false, error: 'Service is temporarily unavailable.' });
  }

  try {
    const countRows = (await sql(`SELECT COUNT(*)::int AS total FROM bookings ${whereClause}`, params)) as {
      total: number;
    }[];
    const total = countRows[0]?.total ?? 0;

    const dataParams = [...params, limit, offset];
    const rows = (await sql(
      `SELECT ${ADMIN_BOOKING_COLUMNS}
       FROM bookings
       ${whereClause}
       ORDER BY ${sortBy} ${sortDir}, booking_time ASC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    )) as BookingRow[];

    return jsonResponse(200, {
      success: true,
      bookings: rows.map(toAdminBookingResponse),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('admin-list-bookings error', error);
    return jsonResponse(500, { success: false, error: 'Unable to load bookings.' });
  }
};
