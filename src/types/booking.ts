export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';

export interface CreateBookingPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // HH:MM (24h)
  numberOfGuests: number;
  specialRequest?: string;
  /** Client-generated UUID so a resubmission (double-click/retry) is treated as one booking. */
  idempotencyKey: string;
  /** Hidden honeypot field - must stay empty. Used only for basic bot detection. */
  website?: string;
}

export interface BookingRecord {
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

export interface BookingApiSuccess {
  success: true;
  booking: BookingRecord;
}

export interface BookingApiError {
  success: false;
  error: string;
}

export type BookingApiResponse = BookingApiSuccess | BookingApiError;
