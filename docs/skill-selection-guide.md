# Skill Selection Guide

## Quick Reference

Use this guide to determine which skill to use for your testing task.

## Decision Flowchart

```
START: What do you need to do?
│
├── Write test cases manually?
│   └── qa/manual-test
│
├── Write automated tests?
│   ├── Unit/component tests? → qa/unit-test
│   ├── API/service tests? → qa/api-test
│   ├── Browser/UI tests? → qa/e2e-test
│   └── Mobile app tests? → qa/mobile-test
│
├── Non-functional testing?
│   ├── Performance/load tests? → qa/performance-test
│   ├── Security testing? → qa/security-test
│   └── Accessibility testing? → qa/accessibility-test
│
├── Test management?
│   ├── Create test plan? → qa/test-plan
│   ├── Review existing tests? → qa/test-review
│   └── Report a bug? → qa/bug-report
│
└── Design test framework?
    └── qa/automation-framework
```

## Skill-by-Skill Guide

### qa/manual-test

**Use when:**
- Writing test cases for user stories
- Planning exploratory testing sessions
- Creating regression checklists
- Documenting UAT scripts
- Applying ISTQB test design techniques

**Trigger phrases:**
- "Write test cases for..."
- "Create exploratory session..."
- "UAT script for..."
- "Boundary value analysis..."

---

### qa/unit-test

**Use when:**
- Writing tests for functions/methods
- Implementing TDD (test-driven development)
- Adding tests to existing code
- Need mocking guidance

**Trigger phrases:**
- "Write unit tests for this function..."
- "TDD for this feature..."
- "How to mock this dependency..."
- "pytest/Jest/JUnit tests for..."

---

### qa/api-test

**Use when:**
- Testing REST or GraphQL endpoints
- Validating response schemas
- Testing authentication flows
- Writing contract tests
- Testing database interactions

**Trigger phrases:**
- "Test this API endpoint..."
- "Write tests for POST /api/users..."
- "Validate JSON schema..."
- "Test authentication..."

---

### qa/e2e-test

**Use when:**
- Automating browser interactions
- Testing user flows end-to-end
- Creating Page Object Models
- Setting up CI for UI tests

**Trigger phrases:**
- "Automate the login flow..."
- "Playwright test for checkout..."
- "Create page objects for..."
- "Cypress test for..."

---

### qa/performance-test

**Use when:**
- Load testing an API or website
- Defining SLA targets
- Running stress/spike/soak tests
- Analyzing performance bottlenecks

**Trigger phrases:**
- "Load test this endpoint..."
- "k6 script for 1000 users..."
- "Stress test the payment API..."
- "Define SLA for response time..."

---

### qa/security-test

**Use when:**
- Testing for OWASP Top 10 vulnerabilities
- Reviewing code for security issues
- Planning penetration testing
- Setting up SAST/DAST tools

**Trigger phrases:**
- "Security test the login..."
- "Check for SQL injection..."
- "OWASP test cases for..."
- "Review this code for security..."

---

### qa/accessibility-test

**Use when:**
- Testing for WCAG compliance
- Verifying screen reader compatibility
- Checking keyboard navigation
- Analyzing color contrast

**Trigger phrases:**
- "Test for WCAG AA compliance..."
- "Check keyboard accessibility..."
- "Screen reader test for..."
- "Color contrast analysis..."

---

### qa/mobile-test

**Use when:**
- Testing iOS or Android apps
- Writing Appium/Detox tests
- Testing touch gestures
- Device compatibility testing

**Trigger phrases:**
- "Test this mobile app..."
- "Appium test for login..."
- "Test swipe gestures..."
- "iOS and Android test matrix..."

---

### qa/test-review

**Use when:**
- Auditing existing test quality
- Finding anti-patterns in tests
- Checking test coverage quality
- Validating "done" criteria

**Trigger phrases:**
- "Review my tests..."
- "Are these tests good?"
- "Check for anti-patterns..."
- "Is this feature done?"

---

### qa/bug-report

**Use when:**
- Documenting a discovered bug
- Creating tickets for Jira/GitHub/Linear
- Classifying bug severity
- Writing reproduction steps

**Trigger phrases:**
- "File a bug for..."
- "Create bug report..."
- "Document this issue..."
- "What severity is this bug?"

---

### qa/test-plan

**Use when:**
- Planning testing for a sprint/release
- Creating risk matrices
- Estimating testing effort
- Defining entry/exit criteria

**Trigger phrases:**
- "Create test plan for..."
- "Test strategy for this release..."
- "Risk matrix for..."
- "Entry and exit criteria..."

---

### qa/automation-framework

**Use when:**
- Designing test automation architecture
- Choosing between frameworks
- Setting up CI/CD pipelines
- Implementing Test Pyramid/Diamond/Trophy

**Trigger phrases:**
- "Design automation framework..."
- "Playwright vs Cypress..."
- "Test Pyramid for our project..."
- "CI pipeline for tests..."

---

## Multiple Skills

Some tasks may benefit from multiple skills:

| Task | Primary Skill | Supporting Skills |
|------|--------------|-------------------|
| Full feature testing | manual-test | unit-test, api-test, e2e-test |
| Security audit | security-test | api-test, test-review |
| Release preparation | test-plan | test-review, performance-test |
| New project setup | automation-framework | e2e-test, unit-test |
| Bug investigation | bug-report | test-review |
| Accessibility audit | accessibility-test | e2e-test |

## Skill Combinations by Project Type

### Web Application
1. qa/manual-test (test cases)
2. qa/unit-test (component tests)
3. qa/api-test (backend tests)
4. qa/e2e-test (browser tests)
5. qa/performance-test (load tests)
6. qa/security-test (OWASP)
7. qa/accessibility-test (WCAG)

### Mobile Application
1. qa/manual-test (test cases)
2. qa/unit-test (component tests)
3. qa/api-test (backend tests)
4. qa/mobile-test (app tests)
5. qa/performance-test (mobile perf)
6. qa/security-test (mobile security)

### API Service
1. qa/api-test (primary)
2. qa/unit-test (business logic)
3. qa/performance-test (load testing)
4. qa/security-test (API security)
5. qa/test-plan (coverage planning)
