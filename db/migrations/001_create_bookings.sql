-- Brothers Biriyani: Table Booking feature
-- Creates the bookings table and supporting objects.
-- There is intentionally NO seat/capacity tracking (no total_seats, available_seats,
-- remaining_seats, or seat_capacity columns) - guest count is informational only.

CREATE TABLE IF NOT EXISTS bookings (
    id                BIGSERIAL PRIMARY KEY,
    booking_reference VARCHAR(20)  NOT NULL,
    customer_name     VARCHAR(120) NOT NULL,
    customer_phone    VARCHAR(20)  NOT NULL,
    customer_email    VARCHAR(255),
    booking_date      DATE         NOT NULL,
    booking_time      TIME         NOT NULL,
    number_of_guests  INTEGER      NOT NULL CHECK (number_of_guests > 0),
    special_request   TEXT,
    status            VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED')),
    -- Used only to make accidental duplicate submissions (double-click / network retry)
    -- idempotent. It never restricts legitimate, separate bookings.
    idempotency_key   UUID,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT bookings_booking_reference_key UNIQUE (booking_reference),
    CONSTRAINT bookings_idempotency_key_key UNIQUE (idempotency_key)
);

-- Multiple bookings for the same date/time/guest-count are expected and allowed;
-- these indexes only speed up lookups, they never enforce a limit.
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_time ON bookings (booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date_time ON bookings (booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings (booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON bookings (customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- Per-day atomic counter used only to generate human-readable booking references
-- such as BB-20260920-0001. This is NOT a seat/capacity counter.
CREATE TABLE IF NOT EXISTS booking_counters (
    counter_date DATE PRIMARY KEY,
    last_number  INTEGER NOT NULL DEFAULT 0
);

-- Keep updated_at current on every change to a booking row.
CREATE OR REPLACE FUNCTION set_bookings_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_bookings_updated_at();
