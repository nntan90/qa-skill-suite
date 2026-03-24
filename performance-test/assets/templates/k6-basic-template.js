// k6 Load Test Template — copy and customize
// Run: k6 run -e BASE_URL=https://api.example.com -e AUTH_TOKEN=xxx k6-basic-template.js

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ─── Custom Metrics ────────────────────────────────────────────────────────
const errorRate     = new Rate('custom_errors');
const responseTime  = new Trend('custom_response_time_ms');
const requestCount  = new Counter('custom_requests_total');

// ─── Test Configuration ────────────────────────────────────────────────────
export const options = {
  // Load profile — edit stages to match your test type:
  // SMOKE:       { duration: '1m',  target: 2   }
  // LOAD:        ramp up → hold → ramp down
  // STRESS:      ramp beyond normal load
  // SPIKE:       sudden burst
  stages: [
    { duration: '2m',  target: 50  },  // Ramp up
    { duration: '5m',  target: 50  },  // Hold
    { duration: '2m',  target: 100 },  // Ramp up more
    { duration: '5m',  target: 100 },  // Hold
    { duration: '2m',  target: 0   },  // Ramp down
  ],

  // SLA Thresholds — test FAILS if these are violated
  thresholds: {
    'http_req_duration':           ['p(95)<200', 'p(99)<500'],
    'http_req_failed':             ['rate<0.01'],
    'custom_errors':               ['rate<0.01'],
  },
};

// ─── Environment ──────────────────────────────────────────────────────────
const BASE_URL   = __ENV.BASE_URL   || 'http://localhost:8000';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

// ─── Setup (runs once before all VUs) ─────────────────────────────────────
export function setup() {
  // Verify service is up before starting the test
  const health = http.get(`${BASE_URL}/health`);
  if (health.status !== 200) {
    throw new Error(`Service health check failed: ${health.status}`);
  }
  console.log(`✅ Service ready at ${BASE_URL}`);
}

// ─── Default Function (runs per VU iteration) ─────────────────────────────
export default function () {
  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`,
  };

  // ── Group 1: Read operation ──────────────────────────────────────────────
  group('GET /api/resource', () => {
    const res = http.get(`${BASE_URL}/api/resource`, { headers });

    requestCount.add(1);
    responseTime.add(res.timings.duration);

    const ok = check(res, {
      'status is 200':          (r) => r.status === 200,
      'response has data':      (r) => r.json('data') !== undefined,
      'response time < 200ms':  (r) => r.timings.duration < 200,
    });

    errorRate.add(!ok);
  });

  sleep(1);  // Think time between requests (simulate real user)

  // ── Group 2: Write operation ─────────────────────────────────────────────
  group('POST /api/resource', () => {
    const payload = JSON.stringify({
      name:  `test-item-${__VU}-${__ITER}`,  // Unique per VU + iteration
      value: Math.floor(Math.random() * 100),
    });

    const res = http.post(`${BASE_URL}/api/resource`, payload, { headers });

    requestCount.add(1);
    responseTime.add(res.timings.duration);

    const ok = check(res, {
      'status is 201':          (r) => r.status === 201,
      'has id in response':     (r) => r.json('id') !== undefined,
      'response time < 300ms':  (r) => r.timings.duration < 300,
    });

    errorRate.add(!ok);
  });

  sleep(2);  // Longer think time after write
}

// ─── Teardown (runs once after all VUs finish) ────────────────────────────
export function teardown(data) {
  console.log('✅ Load test complete');
}
