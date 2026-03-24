# SLA Definition Template

## Service Information
- **Service name**: ___________
- **Environment**: Staging / Production
- **Test date**: ___________
- **Baseline version**: ___________

## Traffic Profile
- **Expected peak concurrent users**: ___________
- **Expected peak RPS (requests per second)**: ___________
- **Peak hours**: ___________

## Performance Targets (SLA)

| Metric | Target | Critical Threshold |
|---|---|---|
| p50 response time | < ___ ms | < ___ ms |
| p95 response time | < ___ ms | < ___ ms |
| p99 response time | < ___ ms | < ___ ms |
| Error rate | < ___% | < ___% |
| Throughput (RPS) | >= ___ RPS | >= ___ RPS |
| CPU usage at peak | < __% | < __% |
| Memory usage at peak | < __% | < __% |

## Test Scenarios

| Test Type | VUs | Duration | Purpose |
|---|---|---|---|
| Smoke | 2 | 2 min | Verify script runs |
| Load | ___ | 15 min | Verify normal traffic |
| Stress | ___ | 30 min | Find degradation point |
| Spike | burst to ___ | 10 min | Resilience to sudden surge |
| Soak | ___ | 2h | Memory/stability over time |

## Endpoints to Test
| Endpoint | Method | Priority | Notes |
|---|---|---|---|
| /api/_____ | GET | P1 | High traffic |
| /api/_____ | POST | P1 | Critical path |

## Pass/Fail Criteria
- **Pass**: All SLA targets met, no Critical/High bugs observed
- **Fail**: Any p95 SLA breached, error rate > critical threshold
- **Warning**: p95 SLA met but within 20% of threshold

## Sign-off
| Role | Name | Date |
|---|---|---|
| QA Engineer | | |
| Dev Lead | | |
| Platform/Infra | | |
