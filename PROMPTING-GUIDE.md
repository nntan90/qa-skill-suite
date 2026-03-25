# QA Skill Suite — Prompting Guide
## How to Talk to the Agent for Best Results

> Written for testers of all levels. No technical background needed to use this guide.

---

## Quick Start — Just Tell the Agent What You Have

You don't need to memorize any template. Just describe what you want to test, paste your spec, or paste your code. The agent will ask for what it needs.

**Good starting prompts:**
- *"I need test cases for the login page. It has email + password fields."*
- *"Write unit tests for this Python function: [paste code]"*
- *"Review my test file and tell me what's wrong: [paste tests]"*
- *"I found a bug. The checkout button doesn't work on Firefox."*

---

## Skill-by-Skill Prompting Guide

---

### 🧪 Manual Test Cases (`qa/manual-test`)

**What it does:** Creates detailed, step-by-step test cases with expected results.

**Best prompt — give it your user story:**
```
Write test cases for this feature:

User story: As a user, I want to register with email + password
Acceptance criteria:
  - Email must be valid format
  - Password must be at least 8 characters
  - Duplicate emails should be rejected
  - After success, user gets a welcome email

Test level: Functional
Environment: Staging
```

**Power prompt — force specific technique:**
```
Write boundary value analysis test cases for the "age" field.
Valid range is 18 to 65. Include min-1, min, min+1, max-1, max, max+1 values.
```

**Exploratory session prompt:**
```
Create an exploratory session charter for the checkout flow.
I want to focus on payment failure scenarios and multi-item carts.
Duration: 60 minutes.
```

**What good output looks like:**
- A table with TC-IDs like `AUTH-REG-FN-001`
- Steps numbered 1, 2, 3...
- Clear "Expected Result" for each step
- At least 7 categories covered (happy path, errors, boundaries, etc.)
- A gap list at the end

---

### ⚙️ Unit Tests (`qa/unit-test`)

**What it does:** Writes automated unit tests for your code. Tells you what to mock and what cases to cover.

**Best prompt — paste your code:**
```
Write unit tests for this function:

[paste your Python / JavaScript / Java code here]

Framework: pytest
I need: happy path, boundary values, and error cases
```

**TDD prompt (test first):**
```
I'm doing TDD. Write tests BEFORE I write the code.
Function signature: calculate_shipping_cost(weight_kg, destination, is_express)
Rules:
  - weight must be between 0.1 and 50 kg
  - destination can be "domestic" or "international"
  - express adds 50% to the base cost
```

**Review existing tests:**
```
Review these tests and tell me what's wrong:

[paste your test file]

I'm using pytest. The tests pass but we still get bugs in production.
```

**What good output looks like:**
- A list of test cases BEFORE the code
- A full, runnable test file
- Each test has at least 2 assertions
- A coverage gap report at the end
- An anti-pattern check (no fake tests, no sleeps, no tautologies)

---

### 🌐 API Tests (`qa/api-test`)

**What it does:** Tests your API endpoints — status codes, response schemas, security, auth.

**Best prompt — describe your endpoint:**
```
Write API tests for:
  POST /api/users
  
Request body: { "name": string (required), "email": string (required), "role": "user" | "admin" }
Auth: Bearer token
Success: 201 with { id, name, email, createdAt }
Errors: 422 if email missing, 409 if email duplicate, 401 if no token

Language: Python (pytest + httpx)
```

**Quick prompt (minimal info):**
```
Write API tests for POST /api/login with email + password.
Return 200 with JWT token on success, 401 on wrong password.
```

**Security-focused prompt:**
```
Test the /api/orders/:id endpoint for security issues.
I have 2 user roles: "user" and "admin".
Focus on: IDOR (can user A access user B's orders?), role-based access, and auth bypass.
```

**What good output looks like:**
- Test cases for EVERY status code (200, 400, 401, 403, 404, 409, 422, 500)
- A JSON schema for response validation
- Field-level checks (e.g., password field must NOT appear in response)
- Auth and IDOR tests
- A coverage summary at the end

---

### 🖥️ E2E Tests (`qa/e2e-test`)

**What it does:** Writes automated browser tests that click buttons and verify the UI works end-to-end.

**Best prompt — describe the user journey:**
```
Write Playwright tests for the login flow:

1. User goes to /login
2. Enters email in the email field
3. Enters password in the password field
4. Clicks "Sign In" button
5. Should redirect to /dashboard
6. Dashboard should show "Welcome, [name]"

Base URL: https://staging.myapp.com
Auth: session cookie
Selectors available: data-testid="email-input", "password-input", "signin-btn", "dashboard-welcome"
```

**If you don't have data-testid yet:**
```
Write Playwright tests for the signup flow. 
The page doesn't have data-testid attributes yet.
Tell me which selectors to add to the HTML.
```

**CI config only prompt:**
```
I already have the Playwright tests. Just give me the GitHub Actions workflow to run them on every PR.
```

**What good output looks like:**
- A step-by-step flow analysis table
- Page Object classes (one per page in the flow)
- A test spec file with happy + error paths
- Auth fixture setup (so login is only done once)
- CI/CD config file
- List of flakiness risks and missing selectors

---

### 📈 Performance Tests (`qa/performance-test`)

**What it does:** Writes load test scripts and tells you if your system can handle traffic.

**Best prompt — give SLA targets:**
```
Write a k6 load test for:
  POST /api/auth/login (email + password)
  GET /api/dashboard (authenticated)

SLA targets:
  p95 response time < 200ms
  p99 response time < 500ms
  Error rate < 1%
  Peak load: 500 concurrent users

Auth: login first, use JWT token in subsequent requests
Base URL: https://staging.api.com
```

**Minimal prompt:**
```
Load test this API: GET /api/products
Expected: 200 users at peak, p95 under 300ms
I want a k6 script.
```

**Specific test type:**
```
Write a spike test for /api/search.
Normally 50 users, spike to 500 users in 30 seconds, hold for 3 minutes.
I want to see if the system recovers after the spike.
```

**What good output looks like:**
- A clear SLA table (what "pass" means)
- Explanation of why this test type was chosen
- A complete, runnable k6 script with thresholds
- How to read the results (what numbers to look for)
- A pass/fail verdict template to fill in

---

### 🔒 Security Tests (`qa/security-test`)

**What it does:** Tests your app for OWASP vulnerabilities — injection, auth flaws, data exposure, etc.

**Best prompt — describe target + roles:**
```
Security test this web app:
  URL: https://staging.myapp.com
  Tech stack: Node.js + PostgreSQL + React
  Auth: JWT (Bearer token)
  User roles: guest, user, admin
  
Focus on: SQL injection, XSS, IDOR, broken authentication
I want: manual test cases with exact payloads
```

**Minimal prompt:**
```
Security test POST /api/users/login
I want to test: brute force protection, token security, and session management.
```

**SAST (code review) prompt:**
```
Review this Python code for security issues:
[paste your code]
Check for: SQL injection, hardcoded secrets, unsafe input handling.
```

**What good output looks like:**
- A threat model summary (who could attack, what's at risk)
- Test cases for each OWASP category, with real payloads to try
- For each finding: CVSS score, what it means, how to fix it
- A pre-release security checklist (checked/failed/N.A.)
- A Go/No-Go verdict for release

---

### 🔍 Test Review (`qa/test-review`)

**What it does:** Reviews your existing tests and tells you honestly what's wrong with them.

**Best prompt — paste your tests:**
```
Review these tests. Tell me what's wrong and what's missing:

[paste your test file]

Context: This tests the user authentication module (login, register, password reset).
Framework: pytest
We keep getting bugs in production even though tests pass.
```

**Quick anti-pattern check:**
```
Check these tests for anti-patterns:
[paste code]
Specifically look for: tests with no assertions, tests that always pass, hard-coded sleeps.
```

**"Is this feature done?" check:**
```
I finished the checkout feature. Here are my tests:
[paste tests]

Run the completion gate. Tell me if I can mark this story as "done".
```

**What good output looks like:**
- A scan result for all 10 anti-patterns (AP-01 to AP-10)
- A real coverage quality score (not just %)
- A findings table with locations and fixes
- A list of important missing test scenarios
- A clear DONE / NOT DONE verdict

---

### 🐛 Bug Reports (`qa/bug-report`)

**What it does:** Turns your bug description into a properly formatted, reproducible bug report.

**Best prompt — describe what happened:**
```
Help me write a bug report:

What happened: The checkout button on /checkout does nothing when I click it.
What should happen: It should submit the order and go to /order/success
How to reproduce:
  1. Log in as a regular user
  2. Add 2 items to cart
  3. Go to /checkout
  4. Fill in card details
  5. Click "Place Order"
  6. Nothing happens. Button doesn't respond.

Browser: Chrome 123
OS: macOS 14
App version: v2.3.1
Console error: TypeError: Cannot read property 'id' of undefined
Severity: I think this is High — affects all checkout users
```

**Minimal prompt (agent fills the blanks):**
```
Bug: The login page shows a 500 error when the email contains a + character.
```

**What good output looks like:**
- A complete bug report (copy-paste ready for Jira/Linear/GitHub)
- Severity AND priority, each with a reason
- A root cause hypothesis with investigation steps
- A reproduction confidence score
- A suggestion for the fix and what test to add after

---

### 📋 Test Plan (`qa/test-plan`)

**What it does:** Creates a complete ISTQB test plan for a sprint, release, or project.

**Best prompt — give sprint details:**
```
Create a test plan for Sprint 14:

Project: E-Commerce Platform
Features in scope:
  - USER-001: User registration with email verification
  - USER-002: Login with Google OAuth
  - PAYMENT-005: Stripe checkout integration

Out of scope:
  - Performance testing (separate plan)
  - Android app

Team: 2 QA engineers, 1 SDET
Sprint duration: 14 days (Mar 20 – Apr 3)
Tech stack: React + Node.js + PostgreSQL
Risk: Payment flow is brand new, never tested in production
```

**Minimal prompt:**
```
Write a test plan for the user authentication module.
It includes: login, register, and password reset.
1 QA, 1 week timeline.
```

**Strategy only:**
```
Write just the risk matrix and exit criteria for a release containing 3 major features:
- New search algorithm
- Payment system upgrade  
- User profile redesign
```

**What good output looks like:**
- A complete 12-section IEEE 829 test plan
- A risk matrix (likelihood + impact + mitigation)
- A full test case matrix with TC-IDs
- Entry/exit criteria with clear "when to start" and "when to stop"
- PERT effort estimate with hours
- A metrics dashboard template
- Sign-off table

---

## Pro Tips for Better Results

### Tip 1: Paste the real thing
The more real content you give, the better. Paste actual code, actual requirements, actual API specs. Don't summarize — paste it.

### Tip 2: Tell the agent what language/framework you use
*"Python + pytest"* or *"TypeScript + Jest"* at the start saves time.

### Tip 3: Mention what you already have
*"I already have happy path tests. I need error cases and boundary values."*
This stops the agent from repeating what you already did.

### Tip 4: Use the output review feature
After the agent gives you output, you can ask:
- *"Review this output. Are there any gaps?"*
- *"I ran the tests. 3 failed. Here are the failures: [paste]. What went wrong?"*
- *"The agent gave me this test plan. Review it like a senior QA manager."*

### Tip 5: Ask "what am I missing?"
At the end of any session, ask:
*"What test scenarios did we not cover? What are the biggest risks we're ignoring?"*

### Tip 6: Use the right skill for the right job

| If you want to... | Use this skill |
|---|---|
| Write manual / UAT test cases | `qa/manual-test` |
| Write automated unit/integration tests | `qa/unit-test` |
| Test an API endpoint | `qa/api-test` |
| Automate browser interactions | `qa/e2e-test` |
| Check if your system can handle load | `qa/performance-test` |
| Find security vulnerabilities | `qa/security-test` |
| Review your existing test code | `qa/test-review` |
| Report a bug properly | `qa/bug-report` |
| Plan testing for a sprint/release | `qa/test-plan` |

---

## Output Review Prompts

Use these to have the agent check its own work (or yours):

```
# Review agent's last output:
"Look at what you just gave me. Are there any scenarios you missed? 
Any edge cases a senior tester would add?"

# Review your own output:
"Review this [test plan / test cases / test file]:
[paste your output]
Act like a senior QA manager. Tell me what's missing or wrong."

# Challenge the coverage:
"You said coverage is 80%. What are the 20% scenarios we're NOT testing?
Are any of them high risk?"

# Check against ISTQB:
"Does this test plan follow ISTQB standards? What sections are missing?"
```

---

*This guide is part of the QA Skill Suite — ISTQB Foundation / Advanced / Management aligned.*
*Repository: https://github.com/nntan90/qa-skill-suite*
