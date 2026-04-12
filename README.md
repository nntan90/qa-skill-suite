# QA Skill Suite — ISTQB Aligned

[![Version](https://img.shields.io/badge/version-4.1-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![ISTQB](https://img.shields.io/badge/ISTQB-Aligned-orange.svg)](./docs/istqb-mapping.md)
[![Validation](https://github.com/nntan90/qa-skill-suite/actions/workflows/validate.yml/badge.svg)](https://github.com/nntan90/qa-skill-suite/actions/workflows/validate.yml)

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
| [`qa/automation-framework`](./automation-framework/SKILL.md) | Test Architecture | Test Pyramid, framework selection, CI/CD integration |
| [`qa/accessibility-test`](./accessibility-test/SKILL.md) | WCAG Compliance | WCAG 2.1 Level AA, screen reader, keyboard navigation, axe-core |
| [`qa/mobile-test`](./mobile-test/SKILL.md) | Mobile Testing | Appium, iOS/Android, touch gestures, device compatibility |

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
| "Design automation framework" | `qa/automation-framework` |
| "Test for WCAG compliance" | `qa/accessibility-test` |
| "Write Appium tests for mobile app" | `qa/mobile-test` |

---

## Verify Installation

After installing, verify the skills are working:

```bash
# Ask your AI assistant
"Load qa skill and list available sub-skills"

# Or test a specific skill
"Use qa/unit-test to write tests for a function that adds two numbers"
```

**Expected output:** The agent should respond with test cases in the TC-ID format or code using your specified framework.

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

## Troubleshooting

### Skill Not Loading

**Problem:** Agent doesn't recognize the skill or says it can't find it.

**Solutions:**
1. Verify the skill folder is in the correct location for your tool
2. Check that SKILL.md exists in the skill folder
3. Restart your AI assistant after installing

### Wrong Skill Loaded

**Problem:** Agent loads a different skill than expected.

**Solutions:**
1. Be more specific in your request (e.g., "Use qa/api-test skill to...")
2. Explicitly mention the skill name
3. Check the routing logic in the root SKILL.md

### Output Not Complete

**Problem:** Agent's output is missing sections.

**Solutions:**
1. Remind the agent to follow the Output Contract
2. Ask "Please complete all sections from the skill's Output Contract"
3. Check if you provided all required inputs

---

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [Skill Selection Guide](./docs/skill-selection-guide.md)
- [ISTQB Mapping](./docs/istqb-mapping.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

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
