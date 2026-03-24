# QA Skill Suite — ISTQB Aligned

> A comprehensive set of Agent Skills for Software Testers and SDETs.  
> Aligned with **ISTQB Foundation · Advanced Test Analyst · Advanced Test Manager · ISO 29119**.  
> Works with Claude Code, GitHub Copilot, Cursor, Gemini CLI, and any [agentskills.io](https://agentskills.io) compatible tool.

---

## Sub-Skills

| Skill | Level | Description |
|---|---|---|
| [`qa`](./SKILL.md) | Root | Routing, ISTQB framework, tech stack matrix, shared principles |
| [`qa/manual-test`](./manual-test/SKILL.md) | Foundation + Advanced TA | EP, BVA, Decision Table, State Transition, Exploratory (SBET), UAT |
| [`qa/unit-test`](./unit-test/SKILL.md) | Component Testing | pytest, Jest, JUnit 5, Mockito, BDD — anti-pattern detection included |
| [`qa/api-test`](./api-test/SKILL.md) | Integration + System | REST/GraphQL, schema validation, IDOR, DB testing, RestAssured, Supertest |
| [`qa/e2e-test`](./e2e-test/SKILL.md) | System Testing | Playwright POM, Cypress, auth fixture, API intercept, CI config |
| [`qa/performance-test`](./performance-test/SKILL.md) | Non-Functional | k6 (load/stress/spike/soak/breakpoint), Locust, JMeter, SLA templates |
| [`qa/security-test`](./security-test/SKILL.md) | OWASP / Pen Test | OWASP WSTG, OWASP Top 10, OWASP LLM Top 10, SAST/DAST tooling |
| [`qa/test-review`](./test-review/SKILL.md) | Quality Audit | 10 anti-patterns, mutation testing, completion gate, coverage audit |
| [`qa/bug-report`](./bug-report/SKILL.md) | Defect Management | Severity matrix, Jira/GitHub/Linear templates |
| [`qa/test-plan`](./test-plan/SKILL.md) | Advanced Management | IEEE 829 / ISO 29119 test plan, PERT estimation, metrics, daily report |

---

## Quick Start

### Install into Claude Code
```bash
mkdir -p .claude/skills
cp -r qa/ .claude/skills/
```

### Install into Cursor
```bash
mkdir -p .cursor/skills
cp -r qa/ .cursor/skills/
```

### Install into GitHub Copilot
```bash
mkdir -p .github/skills
cp -r qa/ .github/skills/
```

---

## How It Works

The agent automatically selects the right sub-skill based on your request:

| You say... | Skill loaded |
|---|---|
| "Write test cases for this form using BVA" | `qa/manual-test` |
| "Write unit tests for this function" | `qa/unit-test` |
| "Test the POST /api/orders endpoint" | `qa/api-test` |
| "Automate the checkout flow in Playwright" | `qa/e2e-test` |
| "Load test this service at 500 RPS" | `qa/performance-test` |
| "Security test the login API" | `qa/security-test` |
| "Review my tests for anti-patterns" | `qa/test-review` |
| "File a bug for this issue" | `qa/bug-report` |
| "Create a test plan for this sprint" | `qa/test-plan` |

---

## ISTQB Coverage

### Test Design Techniques (Foundation + Advanced TA)
- Equivalence Partitioning (EP)
- Boundary Value Analysis (BVA)
- Decision Table Testing
- State Transition Testing
- Use Case Testing
- Pairwise / Combinatorial Testing
- Exploratory Testing (Session-Based — SBET)
- Error Guessing
- Checklist-Based Testing

### Test Types
- Functional · Regression · Smoke · UAT
- Security (OWASP) · Performance · Accessibility

### Languages & Frameworks

| Language | Unit | API | E2E | Performance | Security |
|---|---|---|---|---|---|
| Python | pytest + pytest-mock | httpx + jsonschema | Playwright | Locust / k6 | Bandit / Semgrep |
| JavaScript/TS | Jest / Vitest | Supertest / msw | Playwright / Cypress | k6 | OWASP ZAP |
| Java | JUnit 5 + Mockito | RestAssured | Selenium / Playwright | JMeter / Gatling | OWASP ZAP |
| C# | xUnit / NUnit | RestSharp | Playwright | k6 / NBomber | OWASP ZAP |
| Go | testing + testify | net/http/httptest | Playwright | k6 | gosec |
| Ruby | RSpec | RSpec + Faraday | Capybara / Playwright | k6 | bundler-audit |
| Kotlin | JUnit 5 + MockK | RestAssured | Selenium | Gatling | — |

---

## Repository Structure

```
qa/
├── SKILL.md                          # Root skill — routing + ISTQB framework
├── references/
│   └── istqb-glossary.md             # ISTQB terms reference
├── manual-test/
│   ├── SKILL.md
│   ├── assets/templates/
│   │   ├── test-case-standard.md     # TC-ID format template
│   │   └── exploratory-session.md    # SBET charter template
│   └── references/
├── unit-test/
│   ├── SKILL.md
│   ├── assets/templates/
│   │   └── unit-test-checklist.md
│   └── references/
│       ├── pytest-cheatsheet.md
│       └── jest-cheatsheet.md
├── api-test/
│   ├── SKILL.md
│   └── assets/templates/
│       └── api-test-checklist.md
├── e2e-test/
│   ├── SKILL.md
│   └── assets/templates/
│       ├── playwright-config.ts
│       └── page-object-template.ts
├── performance-test/
│   ├── SKILL.md
│   └── assets/templates/
│       ├── k6-basic-template.js
│       └── sla-definition.md
├── security-test/
│   ├── SKILL.md
│   └── assets/templates/
│       └── vulnerability-report.md
├── test-review/
│   ├── SKILL.md
│   └── assets/templates/
│       └── completion-gate.md
├── bug-report/
│   ├── SKILL.md
│   └── assets/templates/
│       └── bug-report-standard.md
└── test-plan/
    ├── SKILL.md
    └── assets/templates/
        ├── test-plan-full.md
        ├── release-checklist.md
        └── daily-report.md
```

---

## References & Inspiration

- [ISTQB Foundation Syllabus](https://www.istqb.org/certifications/certified-tester-foundation-level)
- [ISTQB Advanced Test Analyst](https://www.istqb.org/certifications/advanced-level-test-analyst)
- [ISTQB Advanced Test Manager](https://www.istqb.org/certifications/advanced-level-test-manager)
- [OWASP Web Security Testing Guide (WSTG)](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [LambdaTest Agent Skills](https://github.com/LambdaTest/agent-skills) — 46 framework skills
- [agentskills.io](https://agentskills.io) — Agent Skills Standard

---

## License

MIT
