// WhatsApp Business Platform (Meta Cloud API) service abstraction.
// This is the ONLY module that talks to the WhatsApp API, and it only ever runs
// server-side (Netlify Functions). Credentials are read from environment variables
// and are never returned to callers or logged.

import { getWhatsAppConfig, getWhatsAppConfigError } from './whatsappConfig';
import type { WhatsAppSendResult } from './whatsappStatus';
import type { BookingResponsePayload } from './types';

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function formatTime(time: string): string {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr ?? '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** Normalizes an Indian mobile number into the digits-only format WhatsApp expects (91XXXXXXXXXX). */
function toWhatsAppPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith('0') && digits.length === 11) return `91${digits.slice(1)}`;
  return digits;
}

function logNotificationEvent(entry: {
  bookingReference: string;
  notificationType: 'restaurant' | 'customer';
  destination: string;
  result: WhatsAppSendResult;
}): void {
  // Never log the access token or any other secret - only operational metadata.
  console.log(
    JSON.stringify({
      event: 'whatsapp_notification',
      bookingReference: entry.bookingReference,
      notificationType: entry.notificationType,
      destination: entry.destination,
      success: entry.result.success,
      statusCode: entry.result.statusCode ?? null,
      error: entry.result.error ?? null,
      timestamp: new Date().toISOString(),
    })
  );
}

interface TextPayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text';
  text: { body: string };
}

interface TemplatePayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: { code: string };
    components: [{ type: 'body'; parameters: { type: 'text'; text: string }[] }];
  };
}

function buildTextPayload(to: string, body: string): TextPayload {
  return { messaging_product: 'whatsapp', to, type: 'text', text: { body } };
}

function buildTemplatePayload(
  to: string,
  templateName: string,
  languageCode: string,
  parameters: string[]
): TemplatePayload {
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [{ type: 'body', parameters: parameters.map((text) => ({ type: 'text', text })) }],
    },
  };
}

/** Low-level call to the WhatsApp Cloud API. Never throws - always resolves with a result. */
export async function sendWhatsAppMessage(payload: TextPayload | TemplatePayload): Promise<WhatsAppSendResult> {
  const config = getWhatsAppConfig();
  const configError = getWhatsAppConfigError(config);
  if (configError) {
    return { success: false, error: configError };
  }

  const url = `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return {
        success: false,
        statusCode: response.status,
        error: `WhatsApp API returned ${response.status}${text ? `: ${text.slice(0, 300)}` : ''}`,
      };
    }

    return { success: true, statusCode: response.status };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown WhatsApp API error.' };
  }
}

/** Sends the new-booking alert to every configured restaurant/owner WhatsApp number. */
export async function sendRestaurantBookingNotification(
  booking: BookingResponsePayload
): Promise<WhatsAppSendResult> {
  const config = getWhatsAppConfig();
  if (!config.enabled) return { success: false, error: 'WhatsApp notifications are disabled.' };
  if (config.restaurantNumbers.length === 0) {
    return { success: false, error: 'BROTHERS_BIRIYANI_WHATSAPP_NUMBER is not configured.' };
  }

  const formattedDate = formatDate(booking.bookingDate);
  const formattedTime = formatTime(booking.bookingTime);
  const specialRequest = booking.specialRequest || 'None';

  const buildPayload = (to: string) =>
    config.messageMode === 'template' && config.restaurantTemplateName
      ? buildTemplatePayload(to, config.restaurantTemplateName, config.templateLanguage, [
          booking.bookingReference,
          booking.customerName,
          booking.customerPhone,
          formattedDate,
          formattedTime,
          String(booking.numberOfGuests),
          specialRequest,
          booking.status,
        ])
      : buildTextPayload(
          to,
          [
            '🍽️ BROTHERS BIRIYANI',
            'New Table Booking',
            '',
            'Booking ID:',
            booking.bookingReference,
            '',
            'Customer:',
            booking.customerName,
            '',
            'Phone:',
            booking.customerPhone,
            '',
            'Date:',
            formattedDate,
            '',
            'Time:',
            formattedTime,
            '',
            '👥 Number of Guests:',
            String(booking.numberOfGuests),
            '',
            'Special Request:',
            specialRequest,
            '',
            'Status:',
            booking.status,
          ].join('\n')
        );

  const recipients = config.restaurantNumbers.map(toWhatsAppPhoneNumber);
  const outcomes = await Promise.all(
    recipients.map(async (to) => {
      const result = await sendWhatsAppMessage(buildPayload(to));
      logNotificationEvent({ bookingReference: booking.bookingReference, notificationType: 'restaurant', destination: to, result });
      return { to, result };
    })
  );

  const failures = outcomes.filter((outcome) => !outcome.result.success);
  if (failures.length === 0) {
    return { success: true };
  }

  return {
    success: false,
    error: failures.map((failure) => `${failure.to}: ${failure.result.error ?? 'unknown error'}`).join(' | '),
  };
}

/** Sends a booking confirmation to the customer's own WhatsApp number. */
export async function sendCustomerBookingConfirmation(
  booking: BookingResponsePayload
): Promise<WhatsAppSendResult> {
  const config = getWhatsAppConfig();
  if (!config.enabled) return { success: false, error: 'WhatsApp notifications are disabled.' };

  const to = toWhatsAppPhoneNumber(booking.customerPhone);
  const formattedDate = formatDate(booking.bookingDate);
  const formattedTime = formatTime(booking.bookingTime);

  const payload =
    config.messageMode === 'template' && config.customerTemplateName
      ? buildTemplatePayload(to, config.customerTemplateName, config.templateLanguage, [
          booking.bookingReference,
          formattedDate,
          formattedTime,
          String(booking.numberOfGuests),
        ])
      : buildTextPayload(
          to,
          [
            '🎉 BROTHERS BIRIYANI',
            '',
            'Your table booking has been received!',
            '',
            'Booking ID:',
            booking.bookingReference,
            '',
            'Date:',
            formattedDate,
            '',
            'Time:',
            formattedTime,
            '',
            'Guests:',
            String(booking.numberOfGuests),
            '',
            'Thank you for choosing Brothers Biriyani.',
            'We look forward to serving you!',
          ].join('\n')
        );

  const result = await sendWhatsAppMessage(payload);
  logNotificationEvent({ bookingReference: booking.bookingReference, notificationType: 'customer', destination: to, result });
  return result;
}
