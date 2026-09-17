# Brothers Biriyani - Restaurant Website 🍛

A modern, responsive restaurant landing page built with React, TypeScript, Vite, and Tailwind CSS, with a Table Booking / Reservation feature backed by Netlify Functions and PostgreSQL.

## 📦 Tech Stack

- **React 19 + TypeScript** - UI
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Netlify Functions** - Serverless backend for table bookings
- **PostgreSQL (Netlify DB / Neon)** - Booking storage, via `@neondatabase/serverless`

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
```

(Or run the same SQL file's contents through your database provider's SQL editor / `netlify db` tooling.)

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

No booking-related secrets are ever read from frontend code, `netlify.toml`, or committed files - only from the server-side environment.

## 📅 Table Booking Feature

### Booking flow

1. Customer clicks **Book a Table** (available in the navigation bar, the mobile menu, and the hero section).
2. A modal form collects the date, time, number of guests, name, mobile number, and optionally email and a special request.
3. On submit, the frontend performs basic UX validation, then calls `POST /api/create-booking`.
4. The Netlify Function independently re-validates and sanitizes every field (the frontend is never trusted alone), applies a light per-phone-number rate limit, generates a unique booking reference, and inserts the booking into PostgreSQL.
5. The customer sees a confirmation screen with their name, date, time, guest count, booking reference, and status.
6. WhatsApp notifications are out of scope for this feature and will be added separately.

**There is no seat/capacity restriction anywhere in this flow.** Any positive number of guests is accepted, and multiple customers can book the same date and time - the "Number of Guests" field is purely informational for the restaurant's planning.

### API endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/create-booking` | POST | Validates, sanitizes, and stores a new booking. Returns the created (or replayed, if resubmitted) booking. |
| `/api/get-booking?reference=BB-20260920-0001` | GET | Looks up a booking by its reference number. |

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
| `created_at` / `updated_at` | `TIMESTAMPTZ` | Managed automatically |

Indexes exist on `booking_date`, `booking_time`, `booking_reference`, `customer_phone`, and `status` for fast lookups. A separate `booking_counters` table generates the per-day sequence used in booking references - it is unrelated to seating capacity.

See [db/migrations/001_create_bookings.sql](db/migrations/001_create_bookings.sql) for the full schema.

## 📱 Sections

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
