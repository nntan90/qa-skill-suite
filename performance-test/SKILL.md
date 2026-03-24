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
  version: '1.0'
---

# Performance Test Skill

## When to Use This Skill

- User wants to verify an API can handle expected traffic
- User wants to find the breaking point of a service
- User needs to validate SLA (e.g., p95 < 200ms)
- User wants to establish a performance baseline before a release
- User needs to benchmark before/after optimization

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

## References

- `references/k6-metrics.md` — all built-in and custom metric types
- `references/k6-executors.md` — constant-vus, ramping-arrival-rate, shared-iterations
- `assets/templates/k6-basic-template.js` — ready-to-use k6 script skeleton
- `assets/templates/locust-template.py` — Locust base file
- `assets/templates/sla-definition.md` — SLA definition template
