# Brothers Biriyani - Restaurant Website 🍛

A modern, responsive restaurant landing page built with React, TypeScript, Vite, and Tailwind CSS, with a Table Booking / Reservation feature backed by Netlify Functions and PostgreSQL.

## 📦 Tech Stack

- **React 19 + TypeScript** - UI
- **React Router** - client-side routing (customer site at `/`, staff dashboard at `/admin/*`)
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Netlify Functions** - Serverless backend for table bookings and the admin dashboard
- **PostgreSQL (Netlify DB / Neon)** - Booking storage, via `@neondatabase/serverless`
- **bcryptjs + jsonwebtoken** - Admin password hashing and session cookies (server-side only)

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- A PostgreSQL database (Netlify DB, Neon, or any Postgres instance)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`) to run the site together with the serverless functions locally

### Install dependencies

```bash
cd brothers-biriyani
npm install
```

### Configure environment variables

Copy `.env.example` to `.env` and set your database connection string:

```bash
cp .env.example .env
```

```
NETLIFY_DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

`.env` is git-ignored and must never be committed. See [Environment Variables](#-environment-variables) below for the full list.

### Run the database migration

Apply the schema to your Postgres/Neon database:

```bash
psql "$NETLIFY_DATABASE_URL" -f db/migrations/001_create_bookings.sql
psql "$NETLIFY_DATABASE_URL" -f db/migrations/002_add_whatsapp_tracking.sql
```

(Or run each SQL file's contents through your database provider's SQL editor / `netlify db` tooling, in order.)

### Start the dev server (with functions)

```bash
netlify dev
```

This serves the Vite app and the Netlify Functions together, so `/api/create-booking` and `/api/get-booking` work exactly as they will in production. `netlify dev` automatically loads variables from `.env`.

Running only `npm run dev` still works for UI development, but the booking API calls will fail since the functions won't be running.

## 🛠️ Build for Production

```bash
npm run build
```

Runs `tsc -b` then `vite build`. Output is written to `dist/`.

```bash
npm run lint
```

Runs `oxlint` across the project.

## 🌐 Netlify Deployment

1. Push the repository to GitHub (or your Git provider of choice).
2. Create a new Netlify site from the repository. Netlify auto-detects the build command (`npm run build`) and publish directory (`dist`) from `netlify.toml`.
3. In the Netlify site dashboard, go to **Site configuration → Environment variables** and add:
   - `NETLIFY_DATABASE_URL` (or `DATABASE_URL`) - your Postgres/Neon connection string.
   - Never put this value in `netlify.toml`, frontend source code, or commit it to Git.
4. Run the database migration (`db/migrations/001_create_bookings.sql`) against your production database before (or immediately after) the first deploy.
5. Deploy. Netlify will build the site and automatically bundle everything in `netlify/functions` as serverless functions, reachable through the `/api/*` redirect defined in `netlify.toml`.

If you're using Netlify DB (the built-in Neon integration), running `netlify db init` provisions the database and injects `NETLIFY_DATABASE_URL` into your site's environment automatically, both locally and in production.

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NETLIFY_DATABASE_URL` | Yes (or `DATABASE_URL`) | PostgreSQL connection string used only by Netlify Functions, never exposed to the frontend. |
| `DATABASE_URL` | Alternative | Used if `NETLIFY_DATABASE_URL` is not set - useful for a self-managed Postgres/Neon instance. |
| `WHATSAPP_ENABLED` | No (default `false`) | Set to `true` to actually call the WhatsApp API. When `false`/unset, bookings work normally and no WhatsApp call is ever made. |
| `WHATSAPP_ACCESS_TOKEN` | Only if enabled | Meta WhatsApp Business Platform access token. |
| `WHATSAPP_PHONE_NUMBER_ID` | Only if enabled | The WhatsApp Business phone number ID messages are sent *from*. |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Recommended if enabled | Your WhatsApp Business Account ID (used for template management/reference). |
| `WHATSAPP_API_VERSION` | No (default `v21.0`) | Graph API version to call. |
| `BROTHERS_BIRIYANI_WHATSAPP_NUMBER` | Only if enabled | Comma-separated restaurant owner/staff numbers that receive new-booking alerts (up to 5 fits the free WhatsApp test-number sandbox). |
| `WHATSAPP_MESSAGE_MODE` | No (default `text`) | `template` (production/recommended) or `text` (testing only - see below). |
| `WHATSAPP_RESTAURANT_TEMPLATE_NAME` | Only if `WHATSAPP_MESSAGE_MODE=template` | Approved template name used for the restaurant notification. |
| `WHATSAPP_CUSTOMER_TEMPLATE_NAME` | Only if `WHATSAPP_MESSAGE_MODE=template` | Approved template name used for the customer confirmation. |
| `WHATSAPP_TEMPLATE_LANGUAGE` | No (default `en_US`) | Language code the templates were approved under. |

No booking-related or WhatsApp secrets are ever read from frontend code, `netlify.toml`, or committed files - only from the server-side environment, and only inside `netlify/functions`.

## 📅 Table Booking Feature

### Booking flow

1. Customer clicks **Book a Table** (available in the navigation bar, the mobile menu, and the hero section).
2. A modal form collects the date, time, number of guests, name, mobile number, and optionally email and a special request.
3. On submit, the frontend performs basic UX validation, then calls `POST /api/create-booking`.
4. The Netlify Function independently re-validates and sanitizes every field (the frontend is never trusted alone), applies a light per-phone-number rate limit, generates a unique booking reference, and inserts the booking into PostgreSQL.
5. The customer sees a confirmation screen with their name, date, time, guest count, booking reference, and status - this on-screen confirmation is the customer's confirmation; no customer-facing WhatsApp message is sent.
6. If `WHATSAPP_ENABLED=true`, the function sends a WhatsApp alert to every configured restaurant/owner number - see [WhatsApp Business Integration](#-whatsapp-business-integration) below. This step never blocks or reverses the booking, which is already saved by this point.

**There is no seat/capacity restriction anywhere in this flow.** Any positive number of guests is accepted, and multiple customers can book the same date and time - the "Number of Guests" field is purely informational for the restaurant's planning.

### API endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/create-booking` | POST | Validates, sanitizes, and stores a new booking. Returns the created (or replayed, if resubmitted) booking. |
| `/api/get-booking?reference=BB-20260920-0001` | GET | Looks up a booking by its reference number. |
| `/api/retry-whatsapp-notification` | POST | Retries only the WhatsApp channel(s) that previously failed for a given `bookingReference`. Never creates a new booking or re-sends an already-`SENT` channel. |

Both are implemented in [netlify/functions](netlify/functions) and are automatically deployed as Netlify Functions; `netlify.toml` maps the friendly `/api/*` paths to `/.netlify/functions/*`.

### Duplicate submission protection

The frontend generates a random idempotency key each time the booking modal is opened and sends it with the request. The database enforces a uniqueness constraint on that key, so accidental double-clicks, browser retries, or network retries return the original booking instead of creating a duplicate - while separate bookings (new modal session, new key) are always accepted, even for the same date, time, and guest count.

### Database structure

Table: `bookings`

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `booking_reference` | `VARCHAR(20)` | Unique, e.g. `BB-20260920-0001` |
| `customer_name` | `VARCHAR(120)` | Required |
| `customer_phone` | `VARCHAR(20)` | Required |
| `customer_email` | `VARCHAR(255)` | Optional |
| `booking_date` | `DATE` | Required |
| `booking_time` | `TIME` | Required |
| `number_of_guests` | `INTEGER` | Required, must be `> 0`; no upper "capacity" limit |
| `special_request` | `TEXT` | Optional |
| `status` | `VARCHAR(20)` | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, or `REJECTED` |
| `idempotency_key` | `UUID` | Unique; used only to dedupe accidental resubmissions |
| `customer_whatsapp_status` | `VARCHAR(20)` | `PENDING`, `SENT`, or `FAILED` - delivery status of the customer's WhatsApp confirmation |
| `restaurant_whatsapp_status` | `VARCHAR(20)` | `PENDING`, `SENT`, or `FAILED` - delivery status of the restaurant's WhatsApp alert |
| `whatsapp_last_error` | `TEXT` | Most recent WhatsApp send error (if any), for troubleshooting/retries |
| `whatsapp_sent_at` | `TIMESTAMPTZ` | When notifications were last attempted (used for retry cooldown) |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | Managed automatically |

Indexes exist on `booking_date`, `booking_time`, `booking_reference`, `customer_phone`, `status`, and both WhatsApp status columns for fast lookups. A separate `booking_counters` table generates the per-day sequence used in booking references - it is unrelated to seating capacity.

See [db/migrations/001_create_bookings.sql](db/migrations/001_create_bookings.sql) and [db/migrations/002_add_whatsapp_tracking.sql](db/migrations/002_add_whatsapp_tracking.sql) for the full schema.

## � WhatsApp Business Integration

WhatsApp notifications sit on top of the booking system as an independent step: **booking creation and WhatsApp delivery are treated as separate operations**. A booking is saved to PostgreSQL first; WhatsApp is only attempted afterward, and its outcome (success or failure) never changes whether the booking exists or is valid.
**By design, only the restaurant's own owner/staff numbers are notified over WhatsApp - customers are never messaged.** The on-screen "Table Booking Received" confirmation is the customer's confirmation. This keeps the whole feature usable indefinitely on Meta's **free WhatsApp test-number sandbox** (up to 5 known recipient numbers), with no payment method and no template approval ever required, since messages never target arbitrary customer numbers.
### 1. WhatsApp Business Platform requirements

To send real messages you need:
- A [Meta WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp) (Cloud API) account.
- A registered WhatsApp Business phone number and its **Phone Number ID**.
- A permanent **access token** (system user token, not a short-lived one) with `whatsapp_business_messaging` permission.
- For production, at least two **approved message templates** (see below) if you plan to message customers/the restaurant outside a 24-hour customer-service session window.

### 2. Required environment variables

See the [Environment Variables](#-environment-variables) table above for the full list (`WHATSAPP_ENABLED`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_API_VERSION`, `BROTHERS_BIRIYANI_WHATSAPP_NUMBER`, `WHATSAPP_MESSAGE_MODE`, `WHATSAPP_RESTAURANT_TEMPLATE_NAME`, `WHATSAPP_CUSTOMER_TEMPLATE_NAME`, `WHATSAPP_TEMPLATE_LANGUAGE`). All of them are read only inside `netlify/functions` and are never bundled into the React app.

### 3. WhatsApp setup

1. Create/verify your WhatsApp Business Account and phone number in [Meta Business Manager](https://business.facebook.com/).
2. Generate a permanent access token for a system user with WhatsApp messaging permission.
3. Copy the **Phone Number ID** and **WhatsApp Business Account ID** from the Meta developer console.
4. Add all the variables above to Netlify (**Site configuration → Environment variables**) - never to `netlify.toml`, source code, or Git.
5. Set `WHATSAPP_ENABLED=true` once you're ready to go live.

### 4. Message template requirements

WhatsApp's Business Platform only allows businesses to freely send **freeform text** messages within a **24-hour customer service session** (i.e., after the user messaged you first). Outside that window - which is the normal case for a brand-new booking notification - you must use a **pre-approved message template**.

This project does not assume arbitrary business-initiated messages are always permitted:
- Set `WHATSAPP_MESSAGE_MODE=template` for production.
- Submit and get approval for two templates in Meta Business Manager:
  - **Restaurant notification template** (`WHATSAPP_RESTAURANT_TEMPLATE_NAME`) - body with 8 variables in this order: booking reference, customer name, customer phone, formatted date, formatted time, number of guests, special request, status.
  - **Customer confirmation template** (`WHATSAPP_CUSTOMER_TEMPLATE_NAME`) - body with 4 variables in this order: booking reference, formatted date, formatted time, number of guests.
- `WHATSAPP_MESSAGE_MODE=text` (the default) sends the exact freeform layout shown in the product spec instead, and is intended for **local testing / sandbox numbers only** - it will fail in production outside an active session window.

### 5. Test mode

Set `WHATSAPP_ENABLED=false` (or leave it unset) to develop and test the booking flow without ever calling the WhatsApp API:
- Booking creation, validation, and the database all work exactly as normal.
- `customer_whatsapp_status` / `restaurant_whatsapp_status` simply stay `PENDING`.
- No network call to `graph.facebook.com` is made.

**Running the free WhatsApp test-number sandbox long-term:** because only restaurant/owner numbers are ever messaged (see above), you can set `WHATSAPP_ENABLED=true` with Meta's **free test phone number** and add each owner's number as a recipient in the test number's "To" list (Meta allows up to 5). This works indefinitely at no cost. Two things to keep in mind: (1) Meta's test numbers are officially intended for testing/development, so very heavy sustained production traffic on one is a soft policy risk even though many small businesses use them this way for low-volume internal alerts; (2) the test number's default access token expires in ~24 hours - generate a **permanent System User token** (see WhatsApp setup above) so the integration doesn't silently stop working every day.

### 6. Production configuration

- Set `WHATSAPP_ENABLED=true` and the WhatsApp credentials as Netlify environment variables. `WHATSAPP_MESSAGE_MODE=template` plus approved templates are only required if you later decide to message customers directly (not part of the current flow).
- Trigger a new deploy after changing environment variables (Netlify only applies them to the next deploy).
- Verify with a real test booking that `restaurant_whatsapp_status` becomes `SENT` in the database for every configured owner number.

### 7. Troubleshooting

- **Both statuses stuck on `PENDING`**: `WHATSAPP_ENABLED` isn't `true` on the deployed site, or the deploy hasn't picked up the environment variable yet (redeploy).
- **Status `FAILED`**: check `whatsapp_last_error` on the booking row, and the Netlify function logs for `create-booking`/`retry-whatsapp-notification` - they log the booking reference, notification type, destination, success/failure, and API status code (never the access token).
- **HTTP 401/403 from WhatsApp**: the access token is invalid, expired, or missing the messaging permission.
- **Template errors**: the template name/language doesn't match an *approved* template in Meta Business Manager, or the number of parameters sent doesn't match the template's variable count.
- **Message never arrives outside testing**: you're likely using `WHATSAPP_MESSAGE_MODE=text` outside a 24-hour session window - switch to `template` mode with an approved template.

### 8. How notification failures are handled

- WhatsApp is only attempted **after** the booking is already committed to PostgreSQL - a booking is never deleted, cancelled, or blocked because of a WhatsApp failure.
- `restaurant_whatsapp_status` reflects the restaurant/owner notification; it's marked `SENT` only once every configured owner number has received it, otherwise `FAILED` with a per-number breakdown in `whatsapp_last_error`.
- `customer_whatsapp_status` tracks the customer-facing status-change notification sent from the admin dashboard (see below) when staff confirm/cancel/reject/complete a booking - it stays `PENDING` until such an action happens.
- `POST /api/retry-whatsapp-notification` with `{ "bookingReference": "BB-..." }` retries the restaurant notification if it previously failed, with a 60-second cooldown between attempts, and never creates a duplicate booking or re-sends if it's already `SENT`.

## 🔒 Admin Dashboard

A staff-only booking management dashboard is available at **`/admin/bookings`**. It reuses the existing `bookings` table and WhatsApp notification system - no duplicate tables, no new booking logic, and no seat/capacity calculations anywhere.

### 1. Admin setup

The dashboard needs no separate database table or user accounts - it's a single shared admin credential, appropriate for one restaurant's staff.

1. Choose a strong password and generate its bcrypt hash locally (never store the plaintext password anywhere):
   ```bash
   node scripts/hash-admin-password.mjs "YourChosenPassword"
   ```
2. Generate a long random session-signing secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
3. Add both as Netlify environment variables (see below) and redeploy.

### 2. Authentication setup

- Staff log in with the shared password at `/admin/login`. The password is checked server-side against `ADMIN_PASSWORD_HASH` using `bcrypt.compare` - the plaintext password is never stored anywhere, only the hash.
- On success, the server issues a signed session token (`ADMIN_SESSION_SECRET`, via `jsonwebtoken`) as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie - it cannot be read by JavaScript (mitigates XSS token theft) and is never sent cross-site.
- Every admin API endpoint (`admin-summary`, `admin-list-bookings`, `admin-update-booking-status`) independently verifies this cookie server-side before doing anything - there is no client-side-only gate.
- Sessions last 12 hours; `/admin/login` and `POST /api/admin-logout` are the only ways to start/end one.

### 3. Environment variables

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | Yes | Bcrypt hash of the staff password (see setup above). |
| `ADMIN_SESSION_SECRET` | Yes | Long random string used to sign/verify session cookies. |

These are read only inside `netlify/functions` and are never sent to the frontend.

### 4. Deployment instructions

No new database migration is required - the admin dashboard reuses the existing `bookings` table and its existing columns (including the WhatsApp status columns from migration 002) as-is. Just:
1. Add `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` to Netlify's environment variables.
2. Deploy as usual (`git push`, Netlify auto-deploys).
3. Visit `https://yourdomain/admin/login`.

### 5. How staff access the dashboard

- Go to `/admin/login`, enter the shared password, and you're redirected to `/admin/bookings`.
- The dashboard is fully responsive - staff can check today's bookings from a phone, tablet, or desktop.
- `/admin/bookings` itself redirects back to `/admin/login` if there is no valid session.

### 6. How bookings are managed

- The dashboard summary shows Today's Bookings, Upcoming Bookings, **Today's Total Guests** (sum of `number_of_guests` for today's non-cancelled/non-rejected bookings - purely informational, never compared against any capacity), and overall Confirmed/Pending/Cancelled counts.
- The booking list can be filtered by date view (Today/Tomorrow/Upcoming/Custom Date), status, customer name, or phone, and sorted by date, time, guest count, or created time. Bookings are grouped by date with a per-date "Total expected guests" figure - again informational only.
- Clicking a booking opens its full details (contact info, special request, timestamps, WhatsApp status) with action buttons to **Confirm**, **Cancel**, **Reject**, or mark **Completed** - these only ever change the `status` column; guest count is never a factor in whether an action is allowed.
- Status changes are idempotent: setting a booking to a status it already has is a no-op and never sends a duplicate WhatsApp notification.

### 7. How WhatsApp notifications are monitored

- Each booking's details panel shows **Restaurant WhatsApp** and **Customer WhatsApp** delivery status (`SENT` / `FAILED` / `PENDING`), plus the last error message if one occurred.
- When staff confirm, cancel, reject, or complete a booking, the existing WhatsApp service (`sendCustomerStatusUpdateNotification`) sends a status-change message to the customer, reusing the same template/text-mode configuration already documented above - no separate WhatsApp integration was built.

## �📱 Sections

1. Hero - headline, imagery, and CTAs (including Book a Table)
2. Brand Highlights
3. Menu - signature dishes
4. Special Offer Banner
5. About - brand story
6. Why Choose Us
7. Gallery
8. Testimonials
9. Contact / CTA
10. Footer

## 🎯 Customization

- **Contact information**: `src/components/Navbar.tsx`, `src/components/CTASection.tsx`, `src/components/Footer.tsx`
- **Menu items**: `src/components/MenuSection.tsx`
- **Colors**: `tailwind.config.js`
- **Booking form fields/copy**: `src/components/BookingModal.tsx`
- **Booking validation rules**: `src/utils/bookingValidation.ts` (frontend) and `netlify/functions/utils/validation.ts` (authoritative, server-side)

---

Made with ❤️ and 🍛 by Brothers Biriyani
