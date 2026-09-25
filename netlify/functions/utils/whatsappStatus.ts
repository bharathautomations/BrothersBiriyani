export type WhatsAppNotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface WhatsAppSendResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

/** Combines two send outcomes into the single whatsapp_last_error column value. */
export function combineWhatsAppErrors(
  restaurant: WhatsAppSendResult,
  customer: WhatsAppSendResult
): string | null {
  const parts: string[] = [];
  if (!restaurant.success && restaurant.error) parts.push(`restaurant: ${restaurant.error}`);
  if (!customer.success && customer.error) parts.push(`customer: ${customer.error}`);
  return parts.length > 0 ? parts.join(' | ') : null;
}

export function toNotificationStatus(result: WhatsAppSendResult): WhatsAppNotificationStatus {
  return result.success ? 'SENT' : 'FAILED';
}
