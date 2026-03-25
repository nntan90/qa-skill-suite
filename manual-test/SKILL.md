---
name: manual-test
description: >
  Plan and execute manual testing, exploratory testing, and session-based testing.
  Load when asked to write manual test cases, plan exploratory sessions, do regression
  testing checklists, acceptance testing (UAT), create test scripts, or design test cases
  using ISTQB techniques (equivalence partitioning, boundary value analysis, decision tables,
  state transition, pairwise). Outputs TC-ID formatted test cases with steps and expected
  results. Trigger phrases: "manual test", "test case", "exploratory testing", "UAT",
  "regression checklist", "acceptance test", "test script", "equivalence partitioning",
  "boundary value", "decision table", "state transition", "exploratory session", "SBET".
metadata:
  author: qa-skill-suite
  version: '3.0'
---

# Manual Test Skill
## ISTQB Foundation + Advanced Test Analyst Aligned

## When to Use This Skill

- User needs manual test cases for a feature or story
- User wants to plan an exploratory testing session
- User needs regression checklist for a release
- User wants UAT (User Acceptance Testing) scripts
- User needs to apply ISTQB test design techniques

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

**BEFORE generating any test cases, the agent MUST collect the following. Ask for missing fields.**

```yaml
INPUT REQUIRED:
  # --- Mandatory ---
  feature_or_story:       # User story / feature name / requirement title
                          # e.g., "User Registration", "Checkout Flow"

  test_basis:             # WHERE requirements come from — choose one or more:
                          # user_story | acceptance_criteria | mockup/wireframe
                          # | api_spec | business_rules | existing_feature_description

  scope:                  # What to test. e.g., "Registration form validation"
                          # What to EXCLUDE. e.g., "Email delivery (separate test)"

  # --- Contextual ---
  user_roles:             # Who uses this feature? e.g., [admin, regular_user, guest]
                          # Default: assume single role if not specified

  priority:               # P1 (critical) | P2 (high) | P3 (medium) | P4 (low)
                          # Default: P2

  test_type:              # functional | regression | smoke | uat | exploratory
                          # Default: functional

  technique_hint:         # Optional — force a technique:
                          # ep | bva | decision_table | state_transition
                          # | pairwise | exploratory | use_case | checklist
                          # Default: agent auto-selects based on feature type

  # --- Optional detail ---
  input_fields:           # List of form fields / parameters, with constraints
                          # e.g., [{name: "age", type: int, range: "18-65"}, ...]

  states:                 # If stateful: list of states + transitions
                          # e.g., [NEW, PENDING, CONFIRMED, SHIPPED, CANCELLED]

  environment:            # staging | local | production
                          # Default: staging

  existing_test_cases:    # Paste any existing TCs to avoid duplication
```

**If user provides raw text (requirement/description):** extract fields from it and confirm before generating.

---

## Output Contract

**The agent MUST produce ALL sections below. No skipping.**

> *"I always make sure to cover the boring cases too — empty fields, wrong roles, network errors. Those are exactly where real bugs hide."*


### Section 1 — Input Interpretation Summary
```
Feature:       [name]
Test Basis:    [source]
Technique(s):  [auto-selected or user-specified]
Risk Level:    P1 / P2 / P3 / P4
Scope:         [in-scope] | [out-of-scope]
```

### Section 2 — Test Case Table (minimum 1 row per scenario category)

| TC-ID | Title | Technique | Priority | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|---|
| [ID] | [title] | EP/BVA/DT/ST | P1–P4 | FN/REG/SMK | [conditions] | [numbered steps] | [exact expected] |

**Mandatory categories — at least 1 TC per row:**
| Category | Min TCs | Description |
|---|---|---|
| Happy Path | ≥ 1 | Valid, typical input — full success flow |
| Invalid Input | ≥ 1 per field | Each required field missing or wrong format |
| Boundary Values | ≥ 6 per range | min-1, min, min+1, max-1, max, max+1 |
| Null / Empty | ≥ 1 | Empty string, null, zero for each key input |
| Authorization | ≥ 1 | Unauthenticated + wrong role |
| Error Recovery | ≥ 1 | System failure / dependency down, retry |
| Negative Flow | ≥ 1 | Intentional misuse, duplicate, conflict |

### Section 3 — Coverage Matrix
```
Total TCs generated:    [N]
Happy path:             [N]
Error/Invalid:          [N]
Boundary:               [N]
Security:               [N]
Automation candidate:   [N] (marked with [AUTO])
Manual-only:            [N]
```

### Section 4 — Gaps & Risks
Explicitly list what is NOT covered and why:
```
Not Covered:
  - [scenario]: [reason — out of scope | needs data | needs environment]

Risks if not covered:
  - [risk description]
```

### Section 5 — Exploratory Charter (if type=exploratory or gaps exist)
```
Charter: "Explore [area] to discover [risks] with focus on [concern]"
Duration: [N] minutes
Areas: [list]
Questions: [list]
```

---

## Workflow

1. **Identify test basis** — requirements, user stories, mockups, specs
2. **Determine risk level** — prioritize what to test deeply vs. lightly
3. **Select test technique** — see technique selector below
4. **Design test conditions** — what aspects of the system to verify
5. **Write test cases** — TC-ID format, steps, expected results
6. **Review for completeness** — use test coverage checklist
7. **Execute and record** — pass/fail, actual results, evidence

## Test Technique Selector (ISTQB)

```
Input has ranges/numeric values?        → Boundary Value Analysis (BVA)
Input can be grouped into categories?   → Equivalence Partitioning (EP)
Multiple conditions → different outcomes? → Decision Table Testing
System has states/transitions?          → State Transition Testing
Workflow involving multiple actors?     → Use Case Testing
Many parameters to combine?             → Pairwise / Combinatorial
Code structure visible?                 → Statement/Branch Coverage
Exploring unknown/new feature?          → Exploratory Testing (SBET)
Routine regression check?               → Checklist-Based Testing
```

## Standard Test Case Format (TC-ID)

```markdown
**TC-ID:** [PROJECT]-[MODULE]-[TYPE]-[NNN]
**Title:** [Short description of what is being tested]
**Priority:** P1 / P2 / P3 / P4
**Test Type:** Functional / Regression / Smoke / UAT / Security
**Technique:** EP / BVA / Decision Table / State Transition / Exploratory
**Preconditions:**
  - [System state required]
  - [Data required]
  - [User role / permissions]

**Test Steps:**
| Step | Action | Test Data | Expected Result |
|------|--------|-----------|-----------------|
| 1 | Navigate to [URL/page] | - | Page loads successfully |
| 2 | Enter [field] | [value] | Field accepts input |
| 3 | Click [button] | - | [Expected outcome] |

**Expected Result:** [Overall expected outcome]
**Actual Result:** [Filled during execution]
**Status:** Pass / Fail / Blocked / Not Run
**Notes / Evidence:** [Screenshot, log reference]
```

## ISTQB Technique Patterns

### Technique 1: Equivalence Partitioning (EP)

Divide the input domain into classes where the system behaves identically. Test one representative from each class.

**Example: Age field (valid: 18–65)**
| Partition | Type | Representative Value | TC |
|---|---|---|---|
| Below minimum | Invalid | 17 | Should reject |
| Valid range | Valid | 30 | Should accept |
| Above maximum | Invalid | 66 | Should reject |
| Non-numeric | Invalid | "abc" | Should reject |
| Empty | Invalid | "" | Should reject |

```markdown
TC-ID: AUTH-AGE-FN-001
Title: Age below minimum (17) is rejected
Steps:
  1. Navigate to registration form
  2. Enter age: 17
  3. Click Submit
Expected: Validation error "Age must be between 18 and 65"
```

### Technique 2: Boundary Value Analysis (BVA)

Test the values at the boundaries of each equivalence partition.

**For range 18–65 (inclusive), test:**
| Value | Boundary Type | Expected |
|---|---|---|
| 17 | Below lower bound | Invalid |
| 18 | Lower bound | Valid |
| 19 | Just above lower bound | Valid |
| 64 | Just below upper bound | Valid |
| 65 | Upper bound | Valid |
| 66 | Above upper bound | Invalid |

**Rule: Always test:** `min-1, min, min+1, max-1, max, max+1`

### Technique 3: Decision Table Testing

For complex business rules with multiple conditions.

**Example: Shipping discount rules**
| Free shipping? | VIP user? | Order > $50? | Result |
|---|---|---|---|
| T | T | T | Free shipping + 20% discount |
| T | T | F | Free shipping |
| T | F | T | Free shipping |
| T | F | F | Free shipping |
| F | T | T | 20% discount |
| F | T | F | No discount |
| F | F | T | No discount |
| F | F | F | No discount |

Each row = one test case. Aim for 100% decision rule coverage.

### Technique 4: State Transition Testing

Map system states and transitions. Test each valid transition + invalid transitions.

**Example: Order State Machine**
```
States: NEW → PENDING → CONFIRMED → SHIPPED → DELIVERED
                                  ↓
                             CANCELLED

Transitions:
NEW       → PENDING     [user submits]
PENDING   → CONFIRMED   [payment succeeds]
PENDING   → CANCELLED   [payment fails]
CONFIRMED → SHIPPED     [warehouse dispatches]
CONFIRMED → CANCELLED   [user cancels before dispatch]
SHIPPED   → DELIVERED   [delivery confirmed]
```

Test matrix — each row is a test case:
| From State | Event | To State | TC-ID |
|---|---|---|---|
| NEW | Submit | PENDING | ORD-STATE-FN-001 |
| PENDING | Pay success | CONFIRMED | ORD-STATE-FN-002 |
| PENDING | Pay fail | CANCELLED | ORD-STATE-FN-003 |
| CONFIRMED | Dispatch | SHIPPED | ORD-STATE-FN-004 |
| DELIVERED | Cancel (invalid!) | - | ORD-STATE-FN-005 (should be rejected) |

### Technique 5: Exploratory Testing (Session-Based — SBET)

Structured exploration without pre-written scripts. Use a charter, time-box, and debrief.

**Session Charter Template:**
```markdown
**Session ID:** EXP-[DATE]-[NUMBER]
**Tester:** [Name]
**Date/Time:** [YYYY-MM-DD HH:MM]
**Duration:** 60–90 minutes (time-boxed)

**Charter (Mission):**
"Explore [area/feature] to discover [risks/behaviors] with focus on [specific concerns]"

Example:
"Explore the checkout flow to discover usability and error-handling issues
with focus on payment failure scenarios and multi-item cart edge cases"

**Areas to Explore:**
- [specific area 1]
- [specific area 2]

**Risks/Questions to Investigate:**
- What happens if payment times out?
- Can users add duplicate items?

**Session Notes:** [Free-form notes during testing]

**Debrief (fill after session):**
- Bugs found: [list with TC-IDs]
- Issues noted: [UX, performance, etc.]
- Areas NOT covered: [what was missed]
- Follow-up charters needed: [yes/no + what]
- Session coverage: [% of charter covered]
```

### Technique 6: Pairwise / Combinatorial Testing

For features with many input parameters — test all 2-way combinations.

**Example: 3 parameters × 3 values = 27 combinations → reduced to 9 pairs**
```
OS:      Windows, macOS, Linux
Browser: Chrome, Firefox, Safari
User:    Admin, Regular, Guest

Pairwise minimum set (all pairs covered):
1. Windows + Chrome + Admin
2. Windows + Firefox + Regular
3. Windows + Safari + Guest
4. macOS   + Chrome + Regular
5. macOS   + Firefox + Guest
6. macOS   + Safari + Admin
7. Linux   + Chrome + Guest
8. Linux   + Firefox + Admin
9. Linux   + Safari + Regular
```

## Regression Test Suite Structure

```
Smoke Suite (10–15 min):
  - Login / logout
  - Navigation to key pages
  - One happy path per major feature
  - No P1 errors

Regression Suite (2–4 hours):
  - All P1 test cases
  - All P2 test cases
  - All previous bug-fix verification tests
  - Boundary cases for recent changes

Full Regression (6–8 hours):
  - All above + P3 cases
  - Cross-browser / cross-device
  - Performance spot-checks
```

## UAT Test Script Template

```markdown
## UAT Test Script: [Feature Name]

**Business Objective:** [Why this feature exists]
**Acceptance Criteria:** [From user story / stakeholder brief]
**Tester (Business User):** [Name / Role]
**Date:** [Date]

### Scenario 1: [Name]
**As a:** [user role]
**I want to:** [action]
**So that:** [business value]

**Preconditions:**
- Logged in as [role]
- [Other prerequisites]

**Steps:**
1. [Plain English step]
2. [Plain English step]
3. [Plain English step]

**Pass Criteria:** [What business user confirms as "working"]
**Result:** ☐ Pass  ☐ Fail  ☐ Blocked
**Comments:** ___________
```

## Test Case Coverage Checklist

```
For each feature, confirm test cases exist for:
[ ] Normal use (happy path)
[ ] Invalid input (each required field, each validation rule)
[ ] Boundary values (min, max, min-1, max+1)
[ ] Empty/null/zero inputs
[ ] Unauthorized access (wrong role, not logged in)
[ ] Concurrent use (two users acting simultaneously)
[ ] Cancellation / undo actions
[ ] Error recovery (retry after failure)
[ ] Large data volumes
[ ] Special characters in text fields
[ ] Browser/device variations (if UI)
[ ] Accessibility (tab order, screen reader labels)
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

- `references/exploratory-charters.md` — charter templates by area type
- `references/istqb-techniques-guide.md` — quick reference for all 7 ISTQB techniques
- `assets/templates/test-case-standard.md` — blank TC-ID template
- `assets/templates/exploratory-session.md` — SBET session charter blank
- `assets/templates/uat-script.md` — UAT script template
- `assets/templates/regression-suite.md` — regression test suite structure
