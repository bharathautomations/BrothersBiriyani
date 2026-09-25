// Central place to read WhatsApp Business Platform configuration from server-side
// environment variables. Never imported from frontend/src code.

export interface WhatsAppConfig {
  enabled: boolean;
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  apiVersion: string;
  /** Restaurant/owner numbers only - notifications never target arbitrary customer numbers. */
  restaurantNumbers: string[];
  /** 'template' is required for production once outside a 24h customer service session. */
  messageMode: 'template' | 'text';
  restaurantTemplateName: string | null;
  customerTemplateName: string | null;
  templateLanguage: string;
}

export function getWhatsAppConfig(): WhatsAppConfig {
  return {
    enabled: process.env.WHATSAPP_ENABLED === 'true',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID ?? '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
    restaurantNumbers: (process.env.BROTHERS_BIRIYANI_WHATSAPP_NUMBER ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0),
    messageMode: process.env.WHATSAPP_MESSAGE_MODE === 'template' ? 'template' : 'text',
    restaurantTemplateName: process.env.WHATSAPP_RESTAURANT_TEMPLATE_NAME || null,
    customerTemplateName: process.env.WHATSAPP_CUSTOMER_TEMPLATE_NAME || null,
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US',
  };
}

/** Returns a human-readable reason WhatsApp can't be used right now, or null if ready. */
export function getWhatsAppConfigError(config: WhatsAppConfig): string | null {
  if (!config.accessToken || !config.phoneNumberId) {
    return 'WhatsApp is enabled but WHATSAPP_ACCESS_TOKEN/WHATSAPP_PHONE_NUMBER_ID are not configured.';
  }
  return null;
}
