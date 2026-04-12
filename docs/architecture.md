# QA Skill Suite Architecture

## Overview

The QA Skill Suite is a collection of AI agent skills designed to assist software testers and SDETs. The architecture follows a modular, hierarchical design aligned with ISTQB testing standards.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ROOT SKILL (qa)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Routing logic                                           │  │
│  │ • Agent persona definition                                │  │
│  │ • ISTQB framework alignment                               │  │
│  │ • Tech stack matrix                                       │  │
│  │ • Shared principles                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                        SUB-SKILLS                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ manual-test  │  │  unit-test   │  │      api-test        │  │
│  │ • EP, BVA    │  │ • pytest     │  │ • REST/GraphQL       │  │
│  │ • Decision   │  │ • Jest       │  │ • Schema validation  │  │
│  │ • State      │  │ • JUnit 5    │  │ • Auth testing       │  │
│  │ • SBET       │  │ • Mocking    │  │ • Contract tests     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   e2e-test   │  │ perf-test    │  │    security-test     │  │
│  │ • Playwright │  │ • k6         │  │ • OWASP Top 10       │  │
│  │ • Cypress    │  │ • Locust     │  │ • WSTG               │  │
│  │ • POM        │  │ • JMeter     │  │ • SAST/DAST          │  │
│  │ • Auth       │  │ • SLA        │  │ • Pen testing        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ test-review  │  │  bug-report  │  │     test-plan        │  │
│  │ • Anti-pat.  │  │ • Severity   │  │ • IEEE 829           │  │
│  │ • Coverage   │  │ • Templates  │  │ • ISO 29119          │  │
│  │ • Quality    │  │ • Jira/GH    │  │ • Metrics            │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ automation   │  │accessibility │  │     mobile-test      │  │
│  │ • Framework  │  │ • WCAG 2.1   │  │ • Appium             │  │
│  │ • Pyramid    │  │ • Screen     │  │ • iOS/Android        │  │
│  │ • CI/CD      │  │ • Keyboard   │  │ • Gestures           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
qa-skill-suite/
├── SKILL.md                    # Root skill - routing and shared config
├── README.md                   # Repository documentation
├── PROMPTING-GUIDE.md          # How to use each skill
├── CONTRIBUTING.md             # Contribution guidelines
├── CHANGELOG.md                # Version history
├── CODE_OF_CONDUCT.md          # Community standards
│
├── references/                 # Shared references
│   └── istqb-glossary.md      # ISTQB terminology
│
├── docs/                       # Documentation
│   ├── architecture.md        # This file
│   ├── skill-selection-guide.md
│   └── istqb-mapping.md
│
├── examples/                   # Sample test suites
│   └── e-commerce-suite/
│
├── [skill-name]/              # Each sub-skill folder
│   ├── SKILL.md               # Skill definition (REQUIRED)
│   ├── assets/
│   │   └── templates/         # Reusable templates
│   └── references/            # Skill-specific cheatsheets
│
└── .github/                   # GitHub configuration
    ├── workflows/
    │   └── validate.yml       # CI/CD validation
    ├── ISSUE_TEMPLATE/
    └── PULL_REQUEST_TEMPLATE.md
```

## SKILL.md Structure

Every SKILL.md follows a consistent structure:

```yaml
---
name: skill-name
description: >
  Description of what this skill does and when to load it.
  Trigger phrases that activate this skill.
metadata:
  author: qa-skill-suite
  version: '4.1'
---

# Skill Name
## Alignment (ISTQB / OWASP / IEEE / etc.)

## When to Use This Skill
[Scenarios for loading this skill]

## Agent Persona
[Senior QA engineer persona definition]

## Output Review Loop
[Self-check template]

## Input Schema
[Required and optional inputs in YAML format]

## Output Contract
[Required output sections with templates]

## Workflow
[Step-by-step process]

## [Domain-Specific Sections]
[Techniques, patterns, tools]

## References
[Links to templates and cheatsheets]
```

## Routing Logic

The root skill routes to sub-skills based on user intent:

| User Request Pattern | Routed Skill |
|---------------------|--------------|
| Manual test case, exploratory, UAT | manual-test |
| Unit test, integration test, TDD | unit-test |
| API test, REST, GraphQL, endpoint | api-test |
| Browser test, UI automation, Playwright | e2e-test |
| Load test, stress test, performance | performance-test |
| Security test, OWASP, vulnerability | security-test |
| Review tests, anti-patterns, audit | test-review |
| File bug, defect report, issue | bug-report |
| Test plan, strategy, metrics | test-plan |
| Framework design, test architecture | automation-framework |
| WCAG, accessibility, screen reader | accessibility-test |
| Mobile app, iOS, Android, Appium | mobile-test |

## ISTQB Alignment

```
ISTQB Foundation Level
├── qa/manual-test (Test Design Techniques)
├── qa/unit-test (Component Testing)
├── qa/api-test (Integration Testing)
└── qa/e2e-test (System Testing)

ISTQB Advanced Test Analyst
├── qa/manual-test (Advanced Techniques)
├── qa/api-test (Contract Testing)
├── qa/security-test (Security Testing)
└── qa/performance-test (Performance Testing)

ISTQB Advanced Test Manager
├── qa/test-plan (Test Strategy)
├── qa/test-review (Quality Assurance)
└── qa/bug-report (Defect Management)

ISTQB Technical Test Analyst
├── qa/security-test (Security Analysis)
├── qa/performance-test (Performance Analysis)
└── qa/automation-framework (Test Automation)
```

## Integration Points

### AI Tools
- Claude Code
- GitHub Copilot
- Cursor
- Gemini CLI
- Any agentskills.io compatible tool

### Testing Frameworks
See the Tech Stack Matrix in the root SKILL.md

### CI/CD Platforms
- GitHub Actions
- GitLab CI
- Jenkins
- Azure DevOps
- CircleCI

## Extension Points

To add a new skill:

1. Create folder: `skill-name/`
2. Add SKILL.md following the standard structure
3. Add assets/templates/ with reusable templates
4. Add references/ with cheatsheets
5. Update root SKILL.md routing logic
6. Update README.md sub-skill table
7. Update CHANGELOG.md
