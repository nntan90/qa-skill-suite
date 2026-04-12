---
name: performance-test
description: >
  Write performance, load, and stress tests for APIs and services. Load when asked to
  load test, stress test, benchmark, or performance test a service. Generates k6 scripts
  (primary), JMeter test plans, and Locust scripts. Provides patterns for spike testing,
  soak testing, breakpoint testing, and interpreting results. Trigger phrases: "load test",
  "performance test", "stress test", "benchmark", "k6", "JMeter", "Locust", "throughput",
  "latency", "RPS", "concurrent users", "response time", "SLA", "p95", "p99".
metadata:
  author: qa-skill-builder
  version: '4.1'
---

# Performance Test Skill

## When to Use This Skill

- User wants to verify an API can handle expected traffic
- User wants to find the breaking point of a service
- User needs to validate SLA (e.g., p95 < 200ms)
- User wants to establish a performance baseline before a release
- User needs to benchmark before/after optimization

---

## Agent Persona

**Act like a senior QA engineer with 20 years of experience.**

- Use plain, clear English. Short sentences. No robot language.
- Be direct. If something is wrong or missing, say it straight.
- Share real experience. Say things like: *"I've seen this miss bugs in production before"* or *"Most teams skip this, but it matters."*
- Always explain WHY a test matters, not just what to do.
- Point out risks even when the user didn't ask.

**Language standard:** Write all output in B1-level English. Simple words. Active voice. One idea per sentence.

---

## Output Review Loop

**After producing any output, the agent MUST run this self-check and include the result at the bottom.**

```
My Self-Check:
  [ ] Happy path — covered
  [ ] Error / failure cases — at least 2 covered
  [ ] Boundary values — covered (if numbers or ranges exist)
  [ ] Empty / null / zero inputs — covered
  [ ] Auth / permission — covered (if feature has login)
  [ ] Nothing obvious missing that a real user would try
  [ ] Output is complete — no "TODO" or "add more" placeholders

Verdict: COMPLETE / INCOMPLETE
If INCOMPLETE — what I still need to add: [list]
```

---
## Input Schema
**Trước khi viết bất kỳ script nào, agent PHẢI thu thập đủ thông tin sau. Nếu user cung cấp mô tả tự do, hãy tự map vào schema trước khi tiến hành.**

```yaml
INPUT REQUIRED:
  # --- Mandatory ---
  target_endpoints:
    description: "Danh sách endpoints cần load test"
    format: "METHOD /path - mô tả ngắn"
    example:
      - "POST /api/auth/login - Đăng nhập user"
      - "GET /api/dashboard - Tải trang dashboard"
      - "POST /api/orders - Tạo đơn hàng"

  sla_targets:
    description: "SLA targets cần đạt (HÓI nếu user chưa cung cấp)"
    fields:
      p95_ms: "95th percentile response time, ví dụ: 200ms"
      p99_ms: "99th percentile response time, ví dụ: 500ms"
      error_rate_pct: "Tỉ lệ lỗi tối đa, ví dụ: 1%"
      min_rps: "Throughput tối thiểu (requests/sec), ví dụ: 500"
    default_if_unknown: "p95<200ms, p99<500ms, error_rate<1%"

  test_type:
    description: "Loại test cần chạy"
    options:
      - "smoke (1-2 VUs, verify script works)"
      - "load (expected peak traffic)"
      - "stress (beyond peak, find degradation)"
      - "spike (sudden burst)"
      - "soak (long duration, memory leak detection)"
      - "breakpoint (continuously increase until failure)"
    default: "load"
    multi_select: true

  expected_load:
    description: "Lưu lượng mong đợi"
    fields:
      peak_vus: "Số Virtual Users đỉnh, ví dụ: 200"
      peak_rps: "Hoặc requests/second đỉnh, ví dụ: 500"
      ramp_up_duration: "Thời gian ramp up, ví dụ: 2m"
      hold_duration: "Thời gian giữ tải, ví dụ: 10m"

  # --- Strongly Recommended ---
  auth_type:
    description: "Cách xác thực API"
    options: ["bearer_token", "api_key", "basic_auth", "session_cookie", "none"]
    if_bearer: "Cung cấp: login endpoint + test credentials cho load test user"

  base_url:
    description: "Base URL của service cần test"
    example: "https://staging.api.com"

  # --- Optional ---
  framework:
    description: "Framework load test"
    options: ["k6 (default)", "locust", "jmeter"]
    default: "k6"

  environment_notes:
    description: "Lưu ý về môi trường test"
    example: "Staging có rate limit 100 RPS per IP, sử dụng VPN riêng"

  output_format:
    description: "Format output kết quả"
    options: ["json", "csv", "stdout", "cloud (k6 cloud)"]
    default: "stdout + json"
```

> Nếu user chỉ nói "load test API này", hãy hỏi `sla_targets` và `expected_load` trước khi viết script. Đây là 2 thông tin bắt buộc để tạo threshold hợp lệ.

---
## Output Contract
**The agent MUST produce ALL sections below. Never skip one.**

> *"Never run a load test without agreeing on SLA targets first. Otherwise, you get a bunch of numbers with no way to say pass or fail. That's not testing — that's just watching metrics."*


### Section 1 — SLA Definition
Bảng SLA chính thức được xác nhận trước khi test:
```
Service: [service name]
Environment: [staging/perf]
Test Date: [date]

SLA Targets:
  p95 response time  < [X]ms
  p99 response time  < [X]ms
  Error rate         < [X]%
  Throughput         >= [X] RPS
  Max VUs            [X]
```

### Section 2 — Test Type Selection Rationale
Giải thích tại sao chọn loại test này, cấu hình stages dự kiến, và mục tiêu cụ thể cần đạt.

### Section 3 — Full k6/Locust Script
Script hoàn chỉnh, chạy được ngay bao gồm:
- Import statements + custom metrics
- `options` block với stages và thresholds ứng với SLA
- `setup()` function (health check + auth nếu cần)
- `default function()` với tất cả endpoints + check assertions
- `teardown()` nếu cần
- ENV variable support (`__ENV.BASE_URL`, `__ENV.AUTH_TOKEN`)
- Lệnh chạy kèm theo (ví dụ: `k6 run -e BASE_URL=... script.js`)

### Section 4 — Threshold Configuration
Giải thích từng threshold trong script:
| Threshold | Value | SLA Mapping | Fail Action |
|---|---|---|---|
| `http_req_duration p(95)` | < 200ms | p95 SLA | Fail test |
| `http_req_failed` | < 1% | Error rate SLA | Fail test |

### Section 5 — Result Interpretation Guide
Hướng dẫn đọc kết quả sau khi chạy:
```
CHECK LIST — Kết quả cần review:
  ✅ http_req_duration p95 = ? ms (target: < [X]ms)
  ✅ http_req_duration p99 = ? ms (target: < [X]ms)
  ✅ http_req_failed rate = ?% (target: < [X]%)
  ✅ http_reqs total = ? (throughput RPS)
  ✅ vus_max = ? (peak concurrent users reached)

RED FLAGS cần check:
  🔴 P95 tăng dần theo thời gian (memory leak / connection pool exhaustion)
  🔴 Error rate tăng đột ngột tại [X VUs] (saturation point)
  🔴 Throughput giảm giữa test (GC pause, thread starvation)
```

### Section 6 — Pass/Fail Verdict Template
```
PERFORMANCE TEST RESULT — [date]
================================
Test Type:    [load/stress/spike/...]
Duration:     [Xm]
Peak VUs:     [X]

RESULTS:
  p95 response:  [X]ms   [PASS/FAIL] (target: <[X]ms)
  p99 response:  [X]ms   [PASS/FAIL] (target: <[X]ms)
  Error rate:    [X]%    [PASS/FAIL] (target: <[X]%)
  Peak RPS:      [X]     [PASS/FAIL] (target: >=[X])

OVERALL: [PASS ✅ / FAIL ❌]

Notes:
  [Ghi chú về bottleneck, khuyến nghị tối ưu, nếu FAIL]
```

---
## Framework Priority

**Default: k6** (JavaScript) — modern, Git-friendly, excellent CLI output, cloud integration.
Use Locust when the team is Python-heavy.
Use JMeter for Java shops or legacy infrastructure.

## Test Types & When to Use Each

| Type | Shape | Goal | Duration |
|---|---|---|---|
| **Smoke test** | 1-2 VUs, briefly | Verify script works, no obvious errors | 1-2 min |
| **Load test** | Ramp up to expected load, hold | Verify system handles normal traffic | 10-30 min |
| **Stress test** | Ramp up beyond expected load | Find degradation point | 20-60 min |
| **Spike test** | Sudden surge then drop | Verify system handles sudden traffic burst | 5-15 min |
| **Soak test** | Constant load, very long | Detect memory leaks, slow degradation | 2-24 hours |
| **Breakpoint** | Continuously increase VUs | Find maximum throughput (saturation point) | Until failure |

## Workflow

1. **Define SLA targets** — agree on p95, p99, error rate thresholds before testing
2. **Start with smoke test** — confirm script runs without errors on 1 VU
3. **Run load test** — simulate expected peak load
4. **Analyze results** — identify slow endpoints, high error rates
5. **Run stress test** — push beyond expected load to find breaking point
6. **Document baseline** — save results for future comparison

## SLA Template (define before testing)

```
Service: User Auth API
Environment: staging

Targets:
  - p95 response time  < 200ms   (95% of requests complete in under 200ms)
  - p99 response time  < 500ms
  - Error rate         < 1%
  - Throughput         >= 500 RPS (at peak load)
  - Max VUs to test    1000
```

## k6 Script Patterns

### Pattern 1: Basic Load Test

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate   = new Rate('errors');
const responseTime = new Trend('response_time_ms');

export const options = {
  stages: [
    { duration: '2m',  target: 100  },  // Ramp up to 100 VUs
    { duration: '5m',  target: 100  },  // Hold at 100 VUs
    { duration: '2m',  target: 200  },  // Ramp up to 200 VUs
    { duration: '5m',  target: 200  },  // Hold at 200 VUs
    { duration: '2m',  target: 0    },  // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<200', 'p(99)<500'],  // SLA gates
    'errors':            ['rate<0.01'],               // < 1% error rate
    'http_req_failed':   ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://api.example.com';

export default function () {
  const res = http.get(`${BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN}` },
  });

  // Assertions
  const ok = check(res, {
    'status is 200':       (r) => r.status === 200,
    'response time < 200': (r) => r.timings.duration < 200,
    'has data field':      (r) => r.json('data') !== undefined,
  });

  errorRate.add(!ok);
  responseTime.add(res.timings.duration);

  sleep(1);  // Think time between requests
}
```

### Pattern 2: Authenticated Flow (Login + Actions)

```javascript
// k6/authenticated-flow.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '10m',
  thresholds: {
    'http_req_duration{group:::Login}':     ['p(95)<500'],
    'http_req_duration{group:::Dashboard}': ['p(95)<200'],
  },
};

const BASE_URL = 'https://api.example.com';

// Setup: runs once, returns shared data to VUs
export function setup() {
  // Pre-warm: verify service is up
  const health = http.get(`${BASE_URL}/health`);
  check(health, { 'service is up': (r) => r.status === 200 });
}

export default function () {
  let token;

  group('Login', () => {
    const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email:    'loadtest@example.com',
      password: 'loadtest-password',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'login returns 200':    (r) => r.status === 200,
      'token is present':     (r) => r.json('access_token') !== undefined,
    });

    token = res.json('access_token');
  });

  sleep(1);

  group('Dashboard', () => {
    const res = http.get(`${BASE_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    check(res, {
      'dashboard returns 200': (r) => r.status === 200,
    });
  });

  sleep(2);
}
```

### Pattern 3: Spike Test

```javascript
// k6/spike-test.js
export const options = {
  stages: [
    { duration: '1m',   target: 10   },  // Normal load
    { duration: '30s',  target: 1000 },  // Spike! 10x traffic
    { duration: '3m',   target: 1000 },  // Hold spike
    { duration: '1m',   target: 10   },  // Scale back down
    { duration: '3m',   target: 10   },  // Recovery period
    { duration: '30s',  target: 0    },  // Ramp down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.05'],  // Allow 5% errors during spike
  },
};
```

### Pattern 4: Breakpoint Test (find max capacity)

```javascript
// k6/breakpoint-test.js
export const options = {
  executor: 'ramping-arrival-rate',
  startRate: 10,
  timeUnit: '1s',
  preAllocatedVUs: 50,
  maxVUs: 1000,
  stages: [
    { duration: '5m', target: 50  },   // 50 RPS
    { duration: '5m', target: 100 },   // 100 RPS
    { duration: '5m', target: 200 },   // 200 RPS
    { duration: '5m', target: 400 },   // 400 RPS
    { duration: '5m', target: 600 },   // Keep going until error rate > 10%
  ],
  thresholds: {
    'http_req_failed': [{ threshold: 'rate<0.10', abortOnFail: true }],
  },
};
```

### Pattern 5: Soak Test (memory leak detection)

```javascript
// k6/soak-test.js
export const options = {
  stages: [
    { duration: '5m',  target: 100 },  // Ramp up
    { duration: '4h',  target: 100 },  // Hold for 4 hours
    { duration: '5m',  target: 0   },  // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<300'],
    'http_req_failed':   ['rate<0.01'],
  },
};
```

## Locust (Python) Equivalent

```python
# locustfile.py
from locust import HttpUser, task, between

class ApiUser(HttpUser):
    wait_time = between(1, 3)  # Think time 1-3 seconds
    token = None

    def on_start(self):
        """Login once when VU starts"""
        response = self.client.post("/api/auth/login", json={
            "email": "loadtest@example.com",
            "password": "loadtest-password"
        })
        self.token = response.json()["access_token"]
        self.client.headers.update({"Authorization": f"Bearer {self.token}"})

    @task(3)  # Weight: runs 3x more than other tasks
    def get_users(self):
        with self.client.get("/api/users", catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Got {response.status_code}")
            elif response.elapsed.total_seconds() > 0.2:
                response.failure("Response too slow")

    @task(1)
    def get_profile(self):
        self.client.get("/api/profile")

    @task(1)
    def create_item(self):
        self.client.post("/api/items", json={
            "name": "test-item",
            "value": 42
        })
```

## Results Interpretation Guide

### Key Metrics to Check

```
http_req_duration ............: avg=X   min=X   med=X   max=X   p(90)=X  p(95)=X
http_req_failed ..............: X%      (must be < 1% for passing)
http_reqs .....................: total RPS
vus ...........................: current virtual users
iterations ...................: total completed scenarios

GREEN FLAGS:
  ✅ p95 < SLA target
  ✅ error rate < 1%
  ✅ throughput stable (not dropping over time)
  ✅ response time flat as VUs increase (linear scaling)

RED FLAGS:
  ❌ p95 or p99 exceeds SLA threshold
  ❌ error rate > 1% (429 Too Many Requests, 503, timeouts)
  ❌ Response time climbs as test duration increases (memory leak / connection pool exhaustion)
  ❌ Throughput drops mid-test (GC pause, thread starvation, DB pool exhaustion)
```

## Run Commands

```bash
# k6 — local run
k6 run k6/load-test.js

# k6 — with environment variables
k6 run -e BASE_URL=https://staging.api.com -e AUTH_TOKEN=xxx k6/load-test.js

# k6 — output to JSON for reporting
k6 run --out json=results/load-test.json k6/load-test.js

# Locust — headless CLI
locust -f locustfile.py --headless -u 100 -r 10 --host=https://api.example.com --run-time 10m

# JMeter — CLI (non-GUI)
jmeter -n -t test-plan.jmx -l results.jtl -e -o html-report/
```

---

## Advanced Testing Patterns

### Pattern 1: Load Profile Selection Guide

The hardest part of performance testing is choosing the RIGHT test type. Here is a decision guide based on what you need to know.

**Test Type Selector:**
```
Question: What do I need to know?
├── "Does the system work at normal load?"      → Average Load Test
├── "What is the maximum load before it breaks?" → Stress Test
├── "Does it break if traffic spikes suddenly?"  → Spike Test
├── "Does it degrade slowly over hours/days?"    → Soak / Endurance Test
├── "Is it fast enough for a quick sanity check?" → Smoke Perf Test
└── "How does it scale when I add servers?"      → Scalability Test
```

**Load profile shapes (k6):**

```javascript
// AVERAGE LOAD — ramp to normal, hold, ramp down
export let options = {
  stages: [
    { duration: '5m',  target: 100 },   // ramp up to 100 users
    { duration: '30m', target: 100 },   // hold at 100 (normal traffic)
    { duration: '5m',  target: 0   },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p95<500'],     // 95% of requests under 500ms
    http_req_failed:   ['rate<0.01'],   // less than 1% errors
  },
};

// STRESS TEST — push beyond normal, find breaking point
export let options = {
  stages: [
    { duration: '5m',  target: 100 },
    { duration: '10m', target: 200 },
    { duration: '10m', target: 300 },
    { duration: '10m', target: 400 },   // keep increasing
    { duration: '5m',  target: 0   },
  ],
  // No strict thresholds — we WANT to find where it breaks
};

// SPIKE TEST — sudden burst of traffic
export let options = {
  stages: [
    { duration: '2m',  target: 50  },   // normal baseline
    { duration: '30s', target: 500 },   // SPIKE — sudden 10x traffic
    { duration: '3m',  target: 500 },   // hold spike
    { duration: '30s', target: 50  },   // back to normal
    { duration: '3m',  target: 50  },   // verify recovery
    { duration: '1m',  target: 0   },
  ],
};

// SOAK / ENDURANCE — run for hours
export let options = {
  stages: [
    { duration: '10m', target: 100 },  // ramp up
    { duration: '4h',  target: 100 },  // hold for 4 hours — check for memory leaks, connection exhaustion
    { duration: '10m', target: 0   },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p95<500'],
    http_req_failed:   ['rate<0.01'],
  },
};

// SMOKE PERF — quick sanity check (is anything obviously broken?)
export let options = {
  vus: 1,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p95<1000'],   // just check it's not 10 seconds
    http_req_failed:   ['rate<0.05'],
  },
};
```

---

### Pattern 2: SLO / SLI / SLA Definition & Measurement

SLO (Service Level Objective), SLI (Service Level Indicator), and SLA (Service Level Agreement) are the industry standard way to define and measure performance. Every performance test must target these.

**Definitions:**
```
SLI = What you measure          (e.g., response time, error rate, availability)
SLO = Target you set internally (e.g., p99 < 500ms, error rate < 0.1%)
SLA = Commitment to customer    (e.g., 99.9% uptime, or we pay penalty)

SLO is stricter than SLA — you set a tighter internal target so SLA is easy to meet.
```

**SLO definition template (for k6 thresholds):**
```javascript
// Define SLOs in k6 thresholds
export let options = {
  thresholds: {
    // Response time SLOs — by percentile
    'http_req_duration':                    ['p50<100', 'p95<300', 'p99<800'],
    'http_req_duration{name:login}':        ['p95<500'],   // per-endpoint SLO
    'http_req_duration{name:checkout}':     ['p95<1000'],
    'http_req_duration{name:search}':       ['p95<200'],
    
    // Availability SLO
    'http_req_failed':                      ['rate<0.001'],  // < 0.1% errors
    
    // Throughput SLO
    'http_reqs':                            ['rate>100'],    // > 100 req/sec minimum
    
    // Custom business metric SLO
    'order_placed':                         ['count>50'],    // > 50 orders placed in test
  },
};

// Tag requests by name for per-endpoint SLOs
http.get(BASE_URL + '/api/products', { tags: { name: 'search' } });
http.post(BASE_URL + '/api/orders', payload, { tags: { name: 'checkout' } });
```

**SLO tracking across releases:**
```markdown
## Performance SLO Dashboard

| Endpoint | SLO | Baseline (v1.0) | Current (v1.1) | Status |
|---|---|---|---|---|
| GET /api/products | p95 < 200ms | 145ms | 162ms | ✅ PASS |
| POST /api/orders | p95 < 1000ms | 780ms | 1100ms | ❌ FAIL — regression! |
| GET /api/user | p95 < 300ms | 89ms | 91ms | ✅ PASS |
| Error rate | < 0.1% | 0.03% | 0.02% | ✅ PASS |

Regression detected: POST /api/orders degraded by 41% — investigate before release.
```

**Error budget concept:**
```
SLO: 99.9% availability (allows 8.7 hours downtime per year)
Error budget: 100% - 99.9% = 0.1% (that's the budget to spend)

If you deploy 10 times per month and each deploy causes 0.01% errors:
  Monthly budget used = 10 × 0.01% = 0.1% ← almost at limit
  → Slow down deployments or improve reliability before next deploy
```

---

### Pattern 3: Authenticated + Multi-Step Flow Test

Most real load tests require authentication. Here is the correct pattern for login-then-use flows.

**k6 — full authenticated workflow:**
```javascript
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Counter, Trend } from 'k6/metrics';

// Custom metrics for business events
const ordersPlaced = new Counter('orders_placed');
const checkoutDuration = new Trend('checkout_duration');

// Load test users from data file (not hardcoded)
const users = new SharedArray('users', function() {
  return JSON.parse(open('./test-data/users.json'));
});

export let options = {
  stages: [
    { duration: '2m',  target: 50  },
    { duration: '10m', target: 50  },
    { duration: '2m',  target: 0   },
  ],
  thresholds: {
    'http_req_duration{name:login}':    ['p95<500'],
    'http_req_duration{name:checkout}': ['p95<2000'],
    'http_req_failed':                  ['rate<0.01'],
    'orders_placed':                    ['count>20'],    // business KPI
  },
};

export default function() {
  // Each VU gets a different user
  const user = users[__VU % users.length];
  
  let token;
  
  // Step 1: Login
  group('Login', () => {
    const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: user.email,
      password: user.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'login' },
    });
    
    check(res, {
      'login status 200': (r) => r.status === 200,
      'login returns token': (r) => r.json('token') !== undefined,
    });
    
    token = res.json('token');
  });
  
  if (!token) return;  // abort if login failed
  
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  
  sleep(1);  // real user pauses between actions
  
  // Step 2: Browse products
  group('Browse', () => {
    const res = http.get(`${BASE_URL}/api/products?category=electronics`, {
      headers: authHeaders,
      tags: { name: 'search' },
    });
    check(res, { 'products loaded': (r) => r.status === 200 });
    
    const products = res.json('data');
    if (!products || products.length === 0) return;
    
    sleep(2);  // user reads the page
    
    // Step 3: View product detail
    const productId = products[0].id;
    http.get(`${BASE_URL}/api/products/${productId}`, {
      headers: authHeaders,
      tags: { name: 'product-detail' },
    });
  });
  
  sleep(1);
  
  // Step 4: Checkout — most business-critical flow
  group('Checkout', () => {
    const startTime = Date.now();
    
    const res = http.post(`${BASE_URL}/api/orders`, JSON.stringify({
      product_id: 1,
      quantity: 1,
      payment_method: 'card',
    }), {
      headers: authHeaders,
      tags: { name: 'checkout' },
    });
    
    checkoutDuration.add(Date.now() - startTime);
    
    if (check(res, {
      'order created 201': (r) => r.status === 201,
      'order has id': (r) => r.json('id') !== undefined,
    })) {
      ordersPlaced.add(1);  // track successful business events
    }
  });
  
  sleep(Math.random() * 3 + 1);  // random think time 1-4 seconds
}
```

---

### Pattern 4: Performance Regression Detection

Every CI pipeline should have a performance gate. If response time regresses by more than X%, the build fails.

**k6 — performance gate script:**
```javascript
// perf-gate.js — run on every PR
export let options = {
  vus: 10,
  duration: '2m',
  thresholds: {
    // These values come from baseline measurement — stored in CI env vars
    'http_req_duration': [
      // p95 must not be more than 20% above baseline
      `p95<${parseInt(__ENV.BASELINE_P95) * 1.20}`,
    ],
    'http_req_failed': ['rate<0.01'],
  },
};
```

**CI integration (GitHub Actions):**
```yaml
name: Performance Gate
on: [pull_request]

jobs:
  perf-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start app
        run: docker-compose up -d && sleep 30
      
      - name: Run k6 performance gate
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/performance/perf-gate.js
        env:
          BASELINE_P95: ${{ vars.PERF_BASELINE_P95_MS }}  # stored in repo variables
          BASE_URL: http://localhost:3000
      
      - name: Upload k6 report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: k6-report
          path: k6-report.html
```

**Reading k6 results — what to look for:**
```
Output field          | What it means                    | Red flag if...
----------------------|----------------------------------|---------------------------
http_req_duration p50 | Median response time             | > 2x your baseline
http_req_duration p95 | 95th percentile (SLO target)     | Exceeds your SLO
http_req_duration p99 | Worst 1% of requests             | > 5x p50 (huge tail latency)
http_req_failed rate  | % of requests that got error     | > 1% for most systems
http_reqs rate        | Throughput (requests per second) | Lower than expected for VU count
vus_max              | Peak concurrent users            | Compare to your test config
data_received         | Total data received               | Much higher than expected → check response sizes
```

---

## Output Review — How to Review Agent's Work

**You can paste the agent's output back and ask for a review.**

Use this prompt:
```
Review this output. Act like a senior QA manager with 20 years of experience.
Tell me:
  1. What test scenarios did you miss?
  2. What is the biggest risk we are NOT testing?
  3. Is this output complete enough to ship? Yes or No, and why.

[paste the output here]
```

The agent will then re-check its own work and give you an honest gap report.

---

## References

- `references/k6-metrics.md` — all built-in and custom metric types
- `references/k6-executors.md` — constant-vus, ramping-arrival-rate, shared-iterations
- `assets/templates/k6-basic-template.js` — ready-to-use k6 script skeleton
- `assets/templates/locust-template.py` — Locust base file
- `assets/templates/sla-definition.md` — SLA definition template
