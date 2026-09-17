import type { BookingResponsePayload, BookingRow } from './types';

export function toBookingResponse(row: BookingRow): BookingResponsePayload {
  return {
    id: row.id,
    bookingReference: row.booking_reference,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    bookingDate: row.booking_date,
    bookingTime: row.booking_time,
    numberOfGuests: row.number_of_guests,
    specialRequest: row.special_request,
    status: row.status,
    createdAt: row.created_at,
  };
}
