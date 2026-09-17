export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';

// Raw shape of a row as returned by PostgreSQL (snake_case column names).
export interface BookingRow {
  id: number;
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  booking_time: string;
  number_of_guests: number;
  special_request: string | null;
  status: BookingStatus;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

// Shape returned to the frontend (camelCase, no internal-only fields).
export interface BookingResponsePayload {
  id: number;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  bookingDate: string;
  bookingTime: string;
  numberOfGuests: number;
  specialRequest: string | null;
  status: BookingStatus;
  createdAt: string;
}
