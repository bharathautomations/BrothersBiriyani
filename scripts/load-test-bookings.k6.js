// k6 load test for the live booking endpoint - run this from k6 Cloud or any multi-IP
// distributed runner, NOT from a single machine (a single-IP burst gets flagged as a
// DDoS/bot attack by Netlify's edge protection and all requests will fail).
//
// Every booking is tagged customerName="LOADTEST-<vu>" and uses phone numbers in the
// reserved 99999xxxxx range so they're easy to find and cancel afterward in /admin/bookings.
//
// Usage:
//   k6 run scripts/load-test-bookings.k6.js                          (local run, lower VUs recommended)
//   k6 cloud login                                                    (one-time auth, needs a free Grafana Cloud account)
//   k6 cloud run scripts/load-test-bookings.k6.js                     (distributed - avoids single-IP blocking)
//   k6 run -e VUS=200 -e TARGET_URL=https://deploy-preview--x.netlify.app/api/create-booking scripts/load-test-bookings.k6.js
import http from 'k6/http';
import { check } from 'k6';

const TARGET_URL = __ENV.TARGET_URL || 'https://brothersbiriyani.com/api/create-booking';
const VUS = Number(__ENV.VUS || 1000);

export const options = {
  scenarios: {
    booking_rush: {
      executor: 'per-vu-iterations',
      vus: VUS,
      iterations: 1,
      maxDuration: '2m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<5000'],
  },
};

function randomPhone(vu) {
  // Reserved synthetic range (99999xxxxx) - valid 10-digit Indian mobile format, never a real customer.
  const n = vu % 100000;
  return `99999${String(n).padStart(5, '0')}`;
}

function randomBookingDate() {
  // Spread across the next 5 days, never today, to stay clear of the same-day 1-hour-advance rule.
  const offsetDays = Math.floor(Math.random() * 5) + 2;
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function () {
  const payload = JSON.stringify({
    customerName: `LOADTEST-${__VU}`,
    customerPhone: randomPhone(__VU),
    bookingDate: randomBookingDate(),
    bookingTime: '19:00',
    numberOfGuests: 2,
    specialRequest: 'LOADTEST - k6 concurrency test, safe to cancel from /admin/bookings.',
  });

  const res = http.post(TARGET_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 201 (booking created)': (r) => r.status === 201,
  });
}
