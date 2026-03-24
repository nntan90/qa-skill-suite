# Verification-Before-Completion Gate

**Feature / Story:** 
**Sprint:** 
**QA Engineer:** 
**Date:** 

---

## Gate 1: Test Completeness
- [ ] All acceptance criteria have at least 1 automated test
- [ ] Test names describe behavior (not just "it works")
- [ ] Happy path + error path per function/endpoint
- [ ] Boundary values tested (BVA: min-1, min, max, max+1)

## Gate 2: Anti-Pattern Check
Run `qa/test-review` skill on test files before merging.

- [ ] No Liar tests (AP-01) — all tests have meaningful assertions
- [ ] No Tautology tests (AP-02) — not testing mocks or constants
- [ ] No Non-Independent tests (AP-03) — tests pass in random order
- [ ] No Over-Mocked tests (AP-04) — real logic is tested
- [ ] No Happy-Path Only (AP-05) — error paths exist
- [ ] No Hard Sleeps (AP-06) — no `setTimeout(N)` or `sleep(N)`
- [ ] No Trivial tests (AP-09) — tests verify actual behavior
- [ ] No Brittle Selectors (AP-10) — uses data-testid or ARIA roles

## Gate 3: Coverage
- [ ] Line coverage ≥ 80% for new code (`pytest --cov` / `jest --coverage`)
- [ ] Branch coverage ≥ 75%
- [ ] All new API endpoints have tests
- [ ] All new UI flows have E2E tests

## Gate 4: CI/CD
- [ ] All tests pass in CI (not just local)
- [ ] Tests complete in < 10 min (unit/integration)
- [ ] No flaky tests (tests pass 3/3 runs)

## Gate 5: Security Baseline
- [ ] No hardcoded secrets in new code (`git grep -i 'password\|secret\|api_key'`)
- [ ] Input validation tested for new endpoints
- [ ] Auth/RBAC tested for new protected endpoints

## Gate 6: Documentation
- [ ] Test cases documented (TC-ID format if manual)
- [ ] API docs updated for new/changed endpoints
- [ ] Significant edge cases noted in code comments

---

**Gate Result:** ✅ All gates passed — DONE  |  ❌ Gates failed — NOT done

**Blockers to resolve:**
- 
