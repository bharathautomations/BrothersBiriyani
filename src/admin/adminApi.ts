export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
export type WhatsAppNotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

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

export interface BookingListFilters {
  view?: 'today' | 'tomorrow' | 'upcoming' | 'custom';
  date?: string;
  status?: BookingStatus | '';
  customerName?: string;
  phone?: string;
  sortBy?: 'date' | 'time' | 'guests' | 'created';
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

const API_BASE = '/api';

async function parseJson<T>(response: Response): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const data = (await response.json()) as T;
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: response.ok, status: response.status, data: null };
  }
}

export async function adminLogin(password: string): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(`${API_BASE}/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const { data } = await parseJson<{ success: boolean; error?: string }>(response);
  return data ?? { success: false, error: 'Unexpected response from the server.' };
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_BASE}/admin-logout`, { method: 'POST' });
}

export async function adminCheckSession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/admin-session`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminSummary(): Promise<AdminSummary | null> {
  const response = await fetch(`${API_BASE}/admin-summary`);
  const { data } = await parseJson<{ success: boolean; summary: AdminSummary }>(response);
  return data?.success ? data.summary : null;
}

export async function fetchAdminBookings(
  filters: BookingListFilters
): Promise<{ bookings: AdminBookingRecord[]; total: number } | null> {
  const params = new URLSearchParams();
  if (filters.view) params.set('view', filters.view);
  if (filters.date) params.set('date', filters.date);
  if (filters.status) params.set('status', filters.status);
  if (filters.customerName) params.set('customerName', filters.customerName);
  if (filters.phone) params.set('phone', filters.phone);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortDir) params.set('sortDir', filters.sortDir);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const response = await fetch(`${API_BASE}/admin-list-bookings?${params.toString()}`);
  const { data } = await parseJson<{ success: boolean; bookings: AdminBookingRecord[]; total: number }>(response);
  return data?.success ? { bookings: data.bookings, total: data.total } : null;
}

export async function updateBookingStatus(
  bookingReference: string,
  status: BookingStatus
): Promise<{ success: boolean; booking?: AdminBookingRecord; error?: string }> {
  const response = await fetch(`${API_BASE}/admin-update-booking-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingReference, status }),
  });
  const { data } = await parseJson<{ success: boolean; booking?: AdminBookingRecord; error?: string }>(response);
  return data ?? { success: false, error: 'Unexpected response from the server.' };
}
