# ISTQB Glossary — Key Terms for QA Skill Suite

## Core Testing Terms

| Term | ISTQB Definition |
|---|---|
| **Test Basis** | The body of knowledge used to design tests (requirements, specs, code, design docs) |
| **Test Condition** | A testable aspect of the component/system identified from the test basis |
| **Test Case** | Set of preconditions, inputs, actions, expected results — to verify a test condition |
| **Test Suite** | A set of test cases for a component/system assembled to achieve a specific goal |
| **Test Procedure** | Sequence of test cases in execution order + setup/teardown |
| **Test Oracle** | A mechanism determining whether a test has passed or failed |
| **Defect** | An imperfection in a component/system that can cause the component/system to fail |
| **Error** | A human action that produces an incorrect result |
| **Failure** | Deviation of the component/system from expected delivery, service, or result |
| **Root Cause** | The fundamental reason for the occurrence of a problem |

## Test Levels

| Level | Scope | Typical Owner |
|---|---|---|
| **Component (Unit)** | Individual units in isolation | Developer |
| **Component Integration** | Interface between components | Developer / SDET |
| **System** | End-to-end system behavior | QA Engineer |
| **System Integration** | Interfaces to external systems | QA Engineer |
| **Acceptance (UAT)** | Business requirements satisfaction | QA + Business |

## Test Types

| Type | Definition |
|---|---|
| **Functional** | Tests WHAT the system does (functionality) |
| **Non-functional** | Tests HOW WELL the system performs (performance, security, usability) |
| **Regression** | Tests to detect defects introduced by changes |
| **Smoke/Sanity** | Quick tests to check if a build is stable enough for full testing |
| **Exploratory** | Simultaneous learning, test design, and execution |
| **Confirmation (Retest)** | Tests to confirm a specific defect has been fixed |

## Coverage Metrics

| Metric | Formula | Good Target |
|---|---|---|
| Statement Coverage | Statements executed / Total statements | ≥ 80% |
| Branch Coverage | Branches executed / Total branches | ≥ 75% |
| Condition Coverage | Conditions evaluated / Total conditions | ≥ 70% |
| Requirement Coverage | Requirements tested / Total requirements | 100% P1 |

## Defect Severity (ISTQB)

| Severity | ISTQB Name | Meaning |
|---|---|---|
| S1 | Blocker | Prevents testing or using the system |
| S2 | Critical | Major feature broken, no workaround |
| S3 | Major | Feature partially impaired, workaround exists |
| S4 | Minor | Cosmetic issue, minimal functional impact |

## Entry and Exit Criteria (ISTQB)

**Entry Criteria** (when to START testing):
- Test environment is set up and stable
- Test data is prepared
- Test cases are reviewed and approved
- Code is deployed to the test environment
- Previous test level passed (if applicable)

**Exit Criteria** (when to STOP testing):
- All planned test cases have been executed
- All critical and high defects are resolved
- Coverage targets are met
- Test summary report is prepared

## Test Estimation Techniques

| Technique | Description |
|---|---|
| **Expert-based** | Experienced tester estimates based on similar past work |
| **Metrics-based** | Use data from previous projects |
| **3-Point (PERT)** | (Optimistic + 4×Most Likely + Pessimistic) / 6 |
| **Test Point Analysis** | Size × Productivity factor |

## Risk-Based Testing

```
Risk Level = Likelihood × Impact

High Risk   (L:High × I:High)  → Full coverage, automated regression
Medium Risk (mixed)            → Happy path + major error paths
Low Risk    (L:Low × I:Low)    → Smoke test only, or skip
```

## ISTQB Test Plan Sections (IEEE 829 / ISO 29119)
1. Test plan identifier
2. Introduction / Scope
3. Test items
4. Features to be tested
5. Features NOT to be tested
6. Approach (strategy)
7. Item pass/fail criteria
8. Suspension and resumption criteria
9. Test deliverables
10. Testing tasks
11. Environmental needs
12. Responsibilities
13. Staffing and training
14. Schedule
15. Risks and contingencies
16. Approvals
