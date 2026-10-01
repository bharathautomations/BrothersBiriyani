import type { Handler, HandlerEvent } from '@netlify/functions';
import { getSqlClient } from './utils/db';
import { isAdminSessionValid } from './utils/adminAuth';
import { getIstTodayIso } from './utils/istDate';
import type { AdminSummary } from './utils/adminTypes';

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

interface SummaryRow {
  todays_bookings: number;
  upcoming_bookings: number;
  todays_total_guests: number;
  confirmed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
}

/**
 * GET /api/admin-summary
 * Dashboard overview counts. "Today's Total Guests" is purely informational (sum of
 * number_of_guests for today's non-cancelled/non-rejected bookings) - there is no seat
 * capacity, no available-seats calculation, and nothing here is compared against a limit.
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' });
  }

  if (!isAdminSessionValid(event)) {
    return jsonResponse(401, { success: false, error: 'Unauthorized.' });
  }

  let sql;
  try {
    sql = getSqlClient();
  } catch (error) {
    console.error('admin-summary: database not configured', error);
    return jsonResponse(500, { success: false, error: 'Service is temporarily unavailable.' });
  }

  try {
    const todayIso = getIstTodayIso();
    const rows = (await sql(
      `SELECT
         COUNT(*) FILTER (WHERE booking_date = $1)::int AS todays_bookings,
         COUNT(*) FILTER (WHERE booking_date > $1)::int AS upcoming_bookings,
         COALESCE(SUM(number_of_guests) FILTER (
           WHERE booking_date = $1 AND status NOT IN ('CANCELLED', 'REJECTED')
         ), 0)::int AS todays_total_guests,
         COUNT(*) FILTER (WHERE status = 'CONFIRMED')::int AS confirmed_bookings,
         COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending_bookings,
         COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled_bookings
       FROM bookings`,
      [todayIso]
    )) as SummaryRow[];

    const row = rows[0];
    const summary: AdminSummary = {
      todaysBookings: row?.todays_bookings ?? 0,
      upcomingBookings: row?.upcoming_bookings ?? 0,
      todaysTotalGuests: row?.todays_total_guests ?? 0,
      confirmedBookings: row?.confirmed_bookings ?? 0,
      pendingBookings: row?.pending_bookings ?? 0,
      cancelledBookings: row?.cancelled_bookings ?? 0,
    };

    return jsonResponse(200, { success: true, summary });
  } catch (error) {
    console.error('admin-summary error', error);
    return jsonResponse(500, { success: false, error: 'Unable to load dashboard summary.' });
  }
};
