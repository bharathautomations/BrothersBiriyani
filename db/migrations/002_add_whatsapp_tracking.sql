-- Brothers Biriyani: WhatsApp notification tracking for bookings.
-- Adds status tracking columns only - no seat/capacity fields are introduced.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS customer_whatsapp_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS restaurant_whatsapp_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS whatsapp_last_error TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_sent_at TIMESTAMPTZ;

ALTER TABLE bookings
  DROP CONSTRAINT IF EXISTS bookings_customer_whatsapp_status_check;
ALTER TABLE bookings
  ADD CONSTRAINT bookings_customer_whatsapp_status_check
    CHECK (customer_whatsapp_status IN ('PENDING', 'SENT', 'FAILED'));

ALTER TABLE bookings
  DROP CONSTRAINT IF EXISTS bookings_restaurant_whatsapp_status_check;
ALTER TABLE bookings
  ADD CONSTRAINT bookings_restaurant_whatsapp_status_check
    CHECK (restaurant_whatsapp_status IN ('PENDING', 'SENT', 'FAILED'));

-- Speeds up finding notifications that still need to be retried.
CREATE INDEX IF NOT EXISTS idx_bookings_customer_whatsapp_status ON bookings (customer_whatsapp_status);
CREATE INDEX IF NOT EXISTS idx_bookings_restaurant_whatsapp_status ON bookings (restaurant_whatsapp_status);
