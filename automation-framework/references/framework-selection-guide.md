# Framework Selection Guide

## Step 1: Choose Test Strategy Shape

| Your situation | Recommended shape |
|---|---|
| Monolith web app, strong dev team | Test Pyramid |
| Microservices, 3-20 services | Test Diamond |
| Microservices, 20+ services | Test Honeycomb |
| React/Vue SPA + REST API | Test Trophy |
| Safety-critical system | Test Pyramid (strict) |
| Early prototype / startup | Inverted Pyramid (pragmatic) |

## Step 2: Choose Framework Pattern

| Situation | Pattern |
|---|---|
| New framework, any team size | Page Object Model (POM) |
| 100+ test scenarios, heavy reuse needed, senior team | Screenplay |
| Same flow, many different data sets | Data-Driven |
| Business stakeholders write/read test cases | BDD (Gherkin + Cucumber) |
| Large enterprise, mix of above | Hybrid |
| API only, no UI | No pattern needed — just pytest/jest with fixtures |

## Step 3: Choose Language + Tools

| Team background | Language | UI | API | Performance | Security |
|---|---|---|---|---|---|
| JavaScript/TypeScript | TypeScript | Playwright | Supertest / axios | k6 | OWASP ZAP |
| Python | Python | Playwright | requests / httpx | Locust / k6 | Bandit / ZAP |
| Java | Java | Selenium / Playwright | RestAssured | JMeter / Gatling | OWASP ZAP |
| C# | C# | Playwright | RestSharp | k6 / NBomber | OWASP ZAP |

## Step 4: CI/CD Platform Config

| Platform | Config file location | Parallel execution |
|---|---|---|
| GitHub Actions | .github/workflows/*.yml | strategy.matrix |
| GitLab CI | .gitlab-ci.yml | parallel keyword |
| Jenkins | Jenkinsfile | parallel { } block |
| CircleCI | .circleci/config.yml | parallelism key |
| Azure DevOps | azure-pipelines.yml | strategy.parallel |

## Automation ROI Decision Matrix

Before automating, ask: is it worth it?

| Test type | Automate? | Reason |
|---|---|---|
| Regression (same flow, every release) | YES — high priority | Saves hours every sprint |
| Smoke (top 10 critical paths) | YES — immediate value | Catches deploy breaks in minutes |
| API contract tests | YES | Catches breaking changes before E2E |
| Complex business rules (many data combos) | YES — data-driven | Impractical manually |
| Exploratory testing | NO | Requires human intuition |
| One-time UAT | NO | Automation cost > manual cost |
| Rapidly changing UI (in design phase) | NO | Too expensive to maintain |
| Accessibility testing | PARTIAL | Tools + manual review |

## Maintenance Budget Planning

| Framework maturity | Annual maintenance budget |
|---|---|
| New framework (year 1) | 40% of initial build time |
| Established (year 2-3) | 20-30% of build time |
| Mature (year 4+) | 15-20% of build time |

If maintenance > 40% of team time → framework needs redesign.
Common causes: no POM, hardcoded test data, test order dependency, no retry logic.
