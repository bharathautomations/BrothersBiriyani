import type { BookingStatus, WhatsAppNotificationStatus } from './types';

// Admin-facing booking shape - includes WhatsApp status fields the public API never exposes.
export interface AdminBookingRecord {
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
  customerWhatsappStatus: WhatsAppNotificationStatus;
  restaurantWhatsappStatus: WhatsAppNotificationStatus;
  whatsappLastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSummary {
  todaysBookings: number;
  upcomingBookings: number;
  todaysTotalGuests: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
}
