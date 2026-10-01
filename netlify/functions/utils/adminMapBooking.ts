import type { BookingRow } from './types';
import type { AdminBookingRecord } from './adminTypes';

/** Admin-facing booking shape - unlike the public API, this includes WhatsApp status fields. */
export function toAdminBookingResponse(row: BookingRow): AdminBookingRecord {
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
    customerWhatsappStatus: row.customer_whatsapp_status,
    restaurantWhatsappStatus: row.restaurant_whatsapp_status,
    whatsappLastError: row.whatsapp_last_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
