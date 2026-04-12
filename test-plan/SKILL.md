---
name: test-plan
description: >
  Create ISTQB-aligned test plans, test strategies, risk analyses, test metrics, and QA
  documentation. Load when asked to write a test plan, test strategy, define testing scope,
  analyze coverage gaps, create test cases for a feature, define metrics, build a QA roadmap,
  or document the QA approach for a sprint, release, or project. Aligns with ISTQB Foundation,
  Advanced Test Manager, and ISO 29119. Generates test plans, risk matrices, coverage maps,
  metrics dashboards, and Definition of Done checklists. Trigger phrases: "test plan",
  "test strategy", "test scope", "QA plan", "coverage analysis", "test metrics", "quality
  metrics", "release checklist", "test manager", "ISTQB test plan", "test policy", "test
  estimation", "risk-based testing", "QA roadmap", "master test plan".
metadata:
  author: qa-skill-suite
  version: '4.1'
---

# Test Plan Skill
## ISTQB Foundation · Advanced Test Manager · ISO 29119 Aligned

## When to Use This Skill

- User needs a test plan for a sprint, release, or project
- User wants to define testing scope and risk-based priorities
- User needs a master test plan (project-level)
- User wants a test strategy (organization/team level)
- User wants to track QA metrics and reporting

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
**Trước khi tạo test plan, agent PHẢI thu thập đủ thông tin sau. Nếu user cung cấp mô tả tự do, hãy tự phân tích và map vào schema, sau đó tạo draft plan. Hỏi lại chỉ khi thiếu thông tin cốt lõi.**

```yaml
INPUT REQUIRED:
  # --- Mandatory ---
  project_name:
    description: "Tên project/sản phẩm"
    example: "E-Commerce Platform v2.0 / User Auth Module / Sprint 14"

  sprint_or_release:
    description: "Sprint hoặc release đang làm test plan"
    example: "Sprint 14 (Mar 20–Apr 3) / Release v2.3.0"

  features_in_scope:
    description: "Danh sách features/user stories cần test"
    format: "Liệt kê từng feature + mô tả ngắn"
    example:
      - "USER-001: User registration with email verification"
      - "USER-002: Login with 2FA (TOTP)"
      - "PAYMENT-005: Stripe checkout integration"

  # --- Strongly Recommended ---
  features_out_of_scope:
    description: "Những gì KHÔNG được test trong sprint này"
    example:
      - "Performance testing — separate plan"
      - "Android native app — mobile team handles"
    note: "Explicit out-of-scope giảm hiểu lầm và scope creep"

  test_levels:
    description: "Các tầng test cần thực hiện"
    options: ["unit", "integration", "api", "e2e", "manual", "uat", "security", "performance"]
    default: "[unit, integration, api, e2e, manual]"
    multi_select: true

  tech_stack:
    description: "Công nghệ sử dụng (lựa chọn tools phù hợp)"
    example: "React + Node.js + PostgreSQL / Python FastAPI + MongoDB"

  team_size:
    description: "Thông tin team QA"
    fields:
      qa_count: "Số QA engineers"
      sdet_count: "Số SDETs (automation)"
      manual_qa_count: "Số manual testers"

  timeline:
    description: "Thời gian testing"
    fields:
      start_date: "Ngày bắt đầu test"
      end_date: "Ngày kết thúc (code freeze / release date)"
      sprint_duration_days: "Số ngày của sprint, ví dụ: 14"

  # --- Optional ---
  risk_context:
    description: "Các rủi ro đã biết cần đưa vào risk matrix"
    example: "Payment integration lần đầu dùng Stripe, chưa test production before"

  environments:
    description: "Các môi trường testing sẵn có"
    example: "staging.app.com (stable), perf.app.com (request 3 days in advance)"

  defect_tool:
    description: "Tool quản lý bug"
    options: ["jira", "github-issues", "linear", "notion", "other"]
    default: "jira"

  automation_coverage_target:
    description: "Mục tiêu automation coverage"
    default: "70% of P1+P2 test cases"
```

> Nếu user nói "viết test plan cho sprint này" và cung cấp feature list, hãy tự tạo draft plan. Hỏi một lần duy nhất về những gì còn thiếu (timeline, team size).

---
## Output Contract
**The agent MUST produce ALL sections below. Never skip one.**

> *"A test plan is not a formality. It's a communication tool. It tells the team: what we're testing, what we're not testing, and what 'done' looks like. If your team doesn't know those three things, you don't have a test plan — you have wishful thinking."*


### Section 1 — Complete ISTQB Test Plan (IEEE 829 / ISO 29119)
Test plan đầy đủ bao gồm tất cả sections sau:
1. Introduction (purpose, background, audience)
2. Scope (in-scope, out-of-scope, test levels table)
3. Risk Analysis (product risks + project risks)
4. Test Approach (strategy, design techniques table, regression strategy)
5. Test Cases (TC matrix + coverage summary)
6. Test Data Requirements (type, source, tool, notes)
7. Test Environment (environments table + dependencies)
8. Entry / Exit Criteria (entry, suspension, exit)
9. Metrics & Reporting (progress metrics, quality metrics, daily report format)
10. Effort Estimation (PERT table)
11. Deliverables (table with owner + due date)
12. Sign-off (table with roles)

### Section 2 — Risk Matrix
Bảng risk đầy đủ:
| Risk ID | Description | Likelihood | Impact | Risk Level | Mitigation | Owner |
|---|---|---|---|---|---|---|
| R-001 | [dựa trên features + risk_context] | H/M/L | H/M/L | HIGH/MEDIUM/LOW | [action] | [team] |

### Section 3 — Test Case Matrix
TC Matrix đầy đủ cho tất cả features in scope:
| TC-ID | Feature | Title | Level | Technique | Priority | Automated | Status |
|---|---|---|---|---|---|---|---|
| [PROJ]-[FEAT]-FN-001 | [feature] | [title] | Unit/API/E2E | EP/BVA/EP+BVA | P1/P2 | Yes/No | ⏽ |

Format TC-ID: `[PROJECT_ABBR]-[FEATURE_ABBR]-[TEST_TYPE]-[NUMBER]`
Ví dụ: `AUTH-REG-FN-001` = Auth module, Registration, Functional, #001

### Section 4 — Entry/Exit Criteria (detailed)
```
ENTRY CRITERIA (khi nào bắt đầu test):
  [ ] Feature code complete and merged to staging
  [ ] Unit tests passing in CI
  [ ] API docs updated
  [ ] Test data seeded
  [ ] Smoke test passing on staging

SUSPENSION CRITERIA (khi nào dừng test):
  • >20% test cases blocked by environment issues
  • Critical blocker bug (S1) found with no workaround
  • [specific criteria từ risk context]

EXIT CRITERIA (khi nào done):
  [ ] 100% P1 TCs executed + passed
  [ ] 100% P2 TCs executed (exceptions documented)
  [ ] 0 open Critical/High defects
  [ ] Code coverage ≥80% for new code
  [ ] Security baseline passed
  [ ] Performance within 20% of baseline
  [ ] QA Lead sign-off obtained
```

### Section 5 — PERT Effort Estimate
Bảng ước tính effort cụ thể:
| Activity | Optimistic | Most Likely | Pessimistic | PERT | Assignee |
|---|---|---|---|---|---|
| Test planning | Xh | Xh | Xh | Xh | QA Lead |
| Writing automation | Xh | Xh | Xh | Xh | SDET |
| Manual/exploratory | Xh | Xh | Xh | Xh | QA |
| Bug reporting + retest | Xh | Xh | Xh | Xh | QA |
| UAT facilitation | Xh | Xh | Xh | Xh | QA + PM |
| **Total** | Xh | Xh | Xh | **Xh** | — |

PERT formula: (O + 4M + P) / 6. Điền số thực tế dựa trên scope + team size.

### Section 6 — Metrics Dashboard Template
Template theo dõi mế triết kỳ:
```
📊 TEST METRICS DASHBOARD — [Sprint/Release]
==========================================
Week [N] | [date range]

Execution Progress:
  Planned:    [N] TCs
  Run:        [N] ([X]%)
  Pass:       [N] ([X]%)
  Fail:       [N]
  Blocked:    [N]

Defect Status:
  New this week: [N] (Critical: X, High: X, Medium: X)
  Total open:    [N]
  Closed:        [N]

Automation:
  Coverage:   [X]% (target: [X]%)
  Pass rate:  [X]%

🚦 Overall: ON TRACK / AT RISK / BLOCKED
🔴 Blockers: [list or NONE]
```

### Section 7 — Sign-off Table
```
TEST PLAN SIGN-OFF
==================
| Role | Name | Date | Decision | Comments |
|------|------|------|----------|----------|
| QA Lead | [name] | [date] | ⏽ Pending | |
| Dev Lead | [name] | [date] | ⏽ Pending | |
| Product Manager | [name] | [date] | ⏽ Pending | |
| Test Manager | [name] | [date] | ⏽ Pending | |

Decision options: Approved ✅ / Approved with Comments 🟡 / Rejected ❌
```

---

## ISTQB Test Plan Hierarchy

```
Test Policy          ← Organization level: "why we test"
Test Strategy        ← Project/team level: "how we test"
Master Test Plan     ← System level: all test levels combined
Feature Test Plans   ← Sprint/feature level: specific scope
```

---

## Full Test Plan Template (IEEE 829 / ISO 29119 Aligned)

```markdown
# Test Plan: [Feature / Sprint / Release Name]

**Test Plan ID:**     TP-[PROJECT]-[VERSION]
**Version:**          1.0
**Author:**           [Name / Team]
**Date:**             [YYYY-MM-DD]
**Sprint / Release:** [Sprint X / v1.2.0]
**Review Date:**      [Date]
**Status:**           Draft / In Review / Approved / Obsolete

---

## 1. Introduction

### 1.1 Purpose
[What this test plan aims to verify. What "done" means from QA perspective.]

### 1.2 Background
[Brief summary of the feature/release being tested. Link to PRD/spec/epic.]

### 1.3 Intended Audience
[QA team, developers, PM, stakeholders]

---

## 2. Scope

### 2.1 In Scope
| Item | Type | Notes |
|---|---|---|
| User registration flow | Functional | New feature |
| Email verification | Functional | New feature |
| Auth module regression | Regression | Changed dependency |

### 2.2 Out of Scope
| Item | Reason | Owner |
|---|---|---|
| Performance testing | Separate performance plan (TP-PERF-001) | DevOps |
| Android native app | Not in this release | Mobile QA team |

### 2.3 Test Levels
| Level | Scope | Automated | Tool |
|---|---|---|---|
| Component (Unit) | Individual functions/classes | ✅ Yes | pytest / Jest |
| Integration | Service boundaries | ✅ Yes | pytest / Supertest |
| API | All new/changed endpoints | ✅ Yes | pytest + httpx |
| System (E2E) | Critical user journeys | ✅ Yes | Playwright |
| UAT | Business acceptance scenarios | 🔲 Manual | QA + PO |
| Security | OWASP Top 10 baseline | 🔲 Manual + ZAP | OWASP ZAP |
| Performance | Baseline benchmark | ✅ Yes | k6 |

---

## 3. Risk Analysis

### 3.1 Product Risks (Quality Risks)
| Risk ID | Risk Description | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| R-001 | Payment flow breaks on edge-case cart states | Medium | Critical | HIGH | Parametrized tests + exploratory session |
| R-002 | Email delivery fails in staging env | High | Medium | MEDIUM | Use Mailhog locally; SendGrid sandbox staging |
| R-003 | Race condition on concurrent user creation | Low | High | MEDIUM | Add concurrency tests |
| R-004 | Token expiry not handled gracefully | Medium | High | HIGH | Auth test suite covers expiry |

### 3.2 Project Risks (Process Risks)
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Test environment unstable | Medium | High | Daily smoke test at 9am; escalate if fails |
| Scope creep adds untested features | Medium | Medium | Require test plan update for any scope change |
| Test automation backlog grows | Low | Medium | Budget 20% sprint capacity for automation debt |

---

## 4. Test Approach

### 4.1 Testing Strategy
- **Risk-based:** P1 risks get full coverage; P3 risks get smoke only
- **Shift-left:** Unit/integration tests written in same sprint as code
- **Automation-first:** All regression paths automated; manual for exploratory only
- **Defense in depth:** Unit → Integration → API → E2E → Security → Performance

### 4.2 Test Design Techniques (ISTQB)
| Feature Area | Technique | Rationale |
|---|---|---|
| Input validation fields | EP + BVA | Input ranges and valid/invalid classes |
| Discount engine | Decision Table | Multiple conditions → multiple outcomes |
| Order state machine | State Transition | Verify all valid + invalid transitions |
| New features (unknown) | Exploratory | Discover unexpected behaviors |
| Config combinations | Pairwise | Reduce 27 combinations to 9 pairs |

### 4.3 Regression Strategy
- **Smoke suite:** Run on every PR merge (~15 min)
- **Regression suite:** Run nightly + before release (~2 hours)
- **Full regression:** Run before major releases (~6 hours)

---

## 5. Test Cases

### 5.1 TC Matrix
| TC-ID | Title | Level | Technique | Priority | Automated | Status |
|---|---|---|---|---|---|---|
| AUTH-REG-FN-001 | Valid registration creates account | System | Happy Path | P1 | ✅ | ⬜ |
| AUTH-REG-FN-002 | Duplicate email → 409 | API | EP | P1 | ✅ | ⬜ |
| AUTH-REG-FN-003 | Email with + character accepted | Unit | BVA | P2 | ✅ | ⬜ |
| AUTH-REG-SEC-001 | SQL injection in email field | API | Security | P1 | ✅ | ⬜ |
| AUTH-VER-FN-001 | Verification link activates account | System | Happy Path | P1 | ✅ | ⬜ |
| AUTH-VER-FN-002 | Expired verification link → error | System | Error Path | P2 | ✅ | ⬜ |

### 5.2 Coverage Summary
| Test Type | Total TCs | Automated | Manual |
|---|---|---|---|
| Functional (Happy Path) | 8 | 8 | 0 |
| Functional (Error/Edge) | 12 | 10 | 2 |
| Security | 6 | 4 | 2 |
| Performance | 2 | 2 | 0 |
| UAT | 5 | 0 | 5 |

---

## 6. Test Data Requirements

| Data Type | Source | Tool/Method | Notes |
|---|---|---|---|
| Valid user accounts | Seed script | `npm run db:seed` | 10 users per role |
| Payment card numbers | Stripe test cards | Fixture file | Never real cards |
| Email inbox | Mailhog (local) | Docker Compose | `docker compose up mailhog` |
| Large datasets | Factory | `factory_boy` / `faker` | 10k records for perf test |

---

## 7. Test Environment

| Environment | URL | Purpose | Managed By |
|---|---|---|---|
| Local (Docker) | localhost:3000 | Unit + integration | Developer |
| Staging | staging.app.com | System + E2E + UAT | DevOps |
| Performance | perf.app.com | Load testing only | DevOps |
| Production | app.com | Smoke test post-deploy | QA |

**Dependencies:**
- Auth service v2.1+ running on port 8001
- PostgreSQL 14+ with migrations applied
- Redis 7+ for session store
- Mailhog for email capture

---

## 8. Entry and Exit Criteria (ISTQB)

### 8.1 Entry Criteria (When to Start)
- [ ] Feature code complete and deployed to staging
- [ ] Unit tests passing in CI (green)
- [ ] API documentation updated (Swagger/OpenAPI)
- [ ] Test data seeded in staging environment
- [ ] Test environment confirmed stable (smoke test passing)

### 8.2 Suspension Criteria (When to Pause)
- Environment unstable: > 20% of tests failing due to env issues
- Critical blocker bug prevents further testing
- Test data corrupted

### 8.3 Exit Criteria (When Testing is Done)
- [ ] All P1 test cases executed and pass
- [ ] All P2 test cases executed (exceptions documented)
- [ ] Zero open Critical (S1) or High (S2) defects
- [ ] Code coverage ≥ 80% for new code
- [ ] E2E smoke test passing on staging
- [ ] Security baseline passed (OWASP ZAP clean)
- [ ] Performance benchmark within 20% of baseline
- [ ] QA sign-off completed

---

## 9. Metrics & Reporting (ISTQB Test Monitoring)

### 9.1 Progress Metrics
| Metric | Formula | Target | Frequency |
|---|---|---|---|
| Test Execution Rate | Tests run / Tests planned | 100% by exit | Daily |
| Pass Rate | Tests passed / Tests run | ≥ 95% | Daily |
| Defect Detection Rate | Bugs found in testing / Total bugs | ≥ 80% | Per release |
| Escaped Defect Rate | Prod bugs / Total bugs | ≤ 5% | Per release |
| Automation Coverage | Automated TCs / Total TCs | ≥ 70% | Per sprint |

### 9.2 Quality Metrics
| Metric | Target | Current | Trend |
|---|---|---|---|
| Code Coverage | ≥ 80% | — | — |
| Open S1 Defects | 0 | — | — |
| Open S2 Defects | 0 | — | — |
| Mean Time to Fix (MTTF) | < 2 days (S2) | — | — |
| Test Debt (not automated) | ≤ 20% | — | — |

### 9.3 Daily Standup Test Report Format
```
📊 Test Progress [Date]
  Planned:  [N] test cases
  Run:      [N] (X%)
  Pass:     [N] (X%)
  Fail:     [N]
  Blocked:  [N]

🐛 Defects
  New:      [N] (S1: X, S2: X, S3: X)
  Open:     [N]
  Fixed:    [N]

🚦 Status: ON TRACK / AT RISK / BLOCKED
🔴 Blockers: [list or none]
```

---

## 10. Effort Estimation (3-Point / PERT)

| Activity | Optimistic | Most Likely | Pessimistic | PERT Estimate |
|---|---|---|---|---|
| Test planning | 2h | 3h | 5h | 3.2h |
| Writing automated tests | 6h | 10h | 16h | 10.3h |
| Manual / exploratory | 2h | 4h | 8h | 4.3h |
| Bug reporting + retest | 1h | 3h | 6h | 3.2h |
| UAT facilitation | 1h | 2h | 4h | 2.2h |
| **Total** | **12h** | **22h** | **39h** | **23.2h** |

PERT formula: (O + 4M + P) / 6

---

## 11. Deliverables

| Deliverable | Owner | Due Date | Status |
|---|---|---|---|
| This test plan | QA Lead | Sprint start | ⬜ |
| Automated test suite | SDET | Sprint end | ⬜ |
| UAT script | QA + PM | Sprint end | ⬜ |
| Bug report (if any) | QA | During sprint | ⬜ |
| Test summary report | QA Lead | Sprint review | ⬜ |

---

## 12. Sign-off

| Role | Name | Date | Signature |
|---|---|---|---|
| QA Lead | | | ⬜ Pending |
| Dev Lead | | | ⬜ Pending |
| Product Manager | | | ⬜ Pending |
| Test Manager | | | ⬜ Pending |
```

---

## Test Strategy Template (Project/Team Level)

```markdown
# Test Strategy: [Project Name]

**Version:** 1.0  **Owner:** QA Manager / Test Manager

## 1. Testing Objectives
- Verify all functional requirements are met
- Ensure non-functional requirements (performance, security) are satisfied
- Minimize escaped defects to production

## 2. Testing Scope
- In scope: [list systems, applications, APIs]
- Out of scope: [third-party systems, legacy modules]

## 3. Test Levels and Types
[Map from Section on Test Levels in qa/SKILL.md]

## 4. Risk-Based Prioritization
- High risk → Full test coverage + exploratory
- Medium risk → Standard coverage
- Low risk → Smoke only

## 5. Test Environment Strategy
- Environments: [dev, staging, perf, prod]
- Data management: [seed scripts, masking, factories]
- Access: [who can access what]

## 6. Defect Management
- Tool: [Jira / Linear / GitHub Issues]
- Severity thresholds for go/no-go
- Triage SLA: S1 = same day, S2 = next day, S3 = sprint backlog

## 7. Test Automation Strategy
- Automation pyramid: 70% unit / 20% API / 10% E2E
- Frameworks: [list by layer]
- Regression trigger: on every PR to main
- Maintenance budget: 10% of sprint

## 8. Metrics and Reporting
- KPIs: pass rate, defect detection, escaped defect rate
- Reports: daily standup, sprint summary, release report

## 9. Tools
| Category | Tool | Purpose |
|---|---|---|
| Test Management | TestRail / Notion | TC documentation |
| Defect Tracking | Jira / Linear | Bug lifecycle |
| CI/CD | GitHub Actions | Automated test runs |
| Monitoring | Datadog / Sentry | Production quality signals |
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

- `assets/templates/test-plan-full.md` — blank test plan
- `assets/templates/test-strategy.md` — blank strategy template
- `assets/templates/dod-story.md` — story DoD template
- `assets/templates/release-checklist.md` — release readiness checklist
- `assets/templates/daily-report.md` — daily test progress report
