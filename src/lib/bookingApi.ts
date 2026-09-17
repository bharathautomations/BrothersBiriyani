import type { BookingApiResponse, CreateBookingPayload } from '../types/booking';

const API_BASE = '/api';

async function parseJsonResponse(response: Response): Promise<BookingApiResponse> {
  try {
    return (await response.json()) as BookingApiResponse;
  } catch {
    return { success: false, error: 'Unexpected response from the booking service.' };
  }
}

export async function createBooking(payload: CreateBookingPayload): Promise<BookingApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/create-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await parseJsonResponse(response);
  } catch {
    return { success: false, error: 'Network error. Please check your connection and try again.' };
  }
}

export async function getBookingByReference(reference: string): Promise<BookingApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/get-booking?reference=${encodeURIComponent(reference)}`);
    return await parseJsonResponse(response);
  } catch {
    return { success: false, error: 'Network error. Please check your connection and try again.' };
  }
}
