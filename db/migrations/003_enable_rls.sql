-- Supabase exposes tables through its public REST API. The Netlify Functions connect
-- directly as the Postgres role (which bypasses RLS), so enabling RLS with no policies
-- blocks all access through the public anon/authenticated API keys.
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_counters ENABLE ROW LEVEL SECURITY;
