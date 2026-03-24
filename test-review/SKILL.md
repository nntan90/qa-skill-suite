---
name: test-review
description: >
  Review test suites for quality issues, anti-patterns, and coverage gaps. Load when
  asked to review tests, audit test quality, find bad tests, detect anti-patterns,
  check if tests are trustworthy, verify test coverage is real (not fake), or analyze
  whether a test suite actually protects the codebase. Identifies: false positives,
  brittle tests, missing assertions, non-independent tests, tautological tests, and
  coverage theater. Also acts as "verification-before-completion" gate — forces
  validation of test completeness before declaring a feature done.
  Trigger phrases: "review my tests", "are these tests good?", "test quality", "anti-pattern",
  "brittle test", "flaky test", "coverage is fake", "verify done", "test audit",
  "check my test suite", "is this test correct?", "test smell".
metadata:
  author: qa-skill-suite
  version: '2.0'
---

# Test Review Skill
## Anti-Pattern Detection · Coverage Audit · ISTQB Advanced

## When to Use This Skill

- User asks "are my tests good?" or "review my test suite"
- User's tests pass but production has bugs — something is wrong
- User wants a quality gate before marking a story "done"
- User wants to identify flaky or brittle tests
- User wants to audit test coverage for real quality (not just % numbers)

## Workflow

1. **Read existing tests** — understand what they claim to test
2. **Detect anti-patterns** — use the catalog below
3. **Assess real coverage** — code coverage ≠ behavior coverage
4. **Identify gaps** — list uncovered scenarios
5. **Generate findings report** — prioritized by severity
6. **Recommend fixes** — specific refactoring for each issue

---

## Anti-Pattern Catalog

### AP-01: The Liar (False Positive)
Test always passes regardless of the implementation. Most dangerous pattern.

**Detection signals:**
- No assertions (test only checks that code runs without throwing)
- `assert True` / `expect(true).toBe(true)` type assertions
- Commented-out assertions
- Tests that mock the value they're asserting

```python
# ❌ ANTI-PATTERN: No assertion
def test_process_payment():
    process_payment(amount=100, card="4111111111111111")
    # passes always — tests nothing

# ✅ CORRECT
def test_process_payment_deducts_from_balance():
    user = create_user(balance=500)
    process_payment(user=user, amount=100)
    assert user.balance == 400
    assert user.last_transaction.amount == 100
    assert user.last_transaction.status == "completed"
```

### AP-02: The Tautology (Self-Confirming Test)
The test is written in terms of implementation, not behavior. Will pass even when the feature is wrong.

```typescript
// ❌ ANTI-PATTERN: Testing implementation, not behavior
it('calculateTotal works', () => {
  const result = calculateTotal([10, 20, 30]);
  expect(result).toBe(calculateTotal([10, 20, 30]));  // always true!
});

// ✅ CORRECT: Test the behavior
it('sums all items in cart', () => {
  expect(calculateTotal([10, 20, 30])).toBe(60);
});
```

### AP-03: The Wet Floor (Non-Independent Test)
Tests depend on shared mutable state. If one fails, others cascade.

**Detection signals:**
- Global variables modified in one test and used in another
- Database not cleaned between tests
- Test order matters

```python
# ❌ ANTI-PATTERN: Shared state
user_id = None

def test_create_user():
    global user_id
    user = create_user(name="Alice")
    user_id = user.id  # other tests depend on this!

def test_delete_user():
    delete_user(user_id)  # fails if test_create_user didn't run first

# ✅ CORRECT: Each test owns its data
def test_delete_user(db_session):
    user = create_user(name="Alice", db=db_session)
    delete_user(user.id, db=db_session)
    assert db_session.get(User, user.id) is None
```

### AP-04: The Mockery (Over-mocked Test)
Everything is mocked — the test only verifies that mocked things return mocked values.

```typescript
// ❌ ANTI-PATTERN: Testing the mock, not the logic
it('sends email', async () => {
  const mockSend = jest.fn().mockResolvedValue({ sent: true });
  jest.mock('../emailService', () => ({ send: mockSend }));
  const result = await mockSend({ to: 'test@example.com' });  // calling mock directly!
  expect(result.sent).toBe(true);  // tests nothing
});

// ✅ CORRECT: Mock only the I/O dependency, test the real business logic
it('sends welcome email with correct template', async () => {
  const mockSend = jest.spyOn(emailService, 'send').mockResolvedValue({ sent: true });
  const user = { name: 'Alice', email: 'alice@example.com' };
  await sendWelcomeEmail(user);                  // calls real function
  expect(mockSend).toHaveBeenCalledWith({        // verify what was sent
    to: 'alice@example.com',
    subject: 'Welcome, Alice!',
    template: 'welcome',
    data: { name: 'Alice' }
  });
});
```

### AP-05: The Optimist (Happy-Path Only)
Test suite only covers success scenarios. Error paths are never tested.

**Detection:** Review test names — if all say "successfully..." or "returns correctly...", you have the Optimist.

```
✅ Test names should include both:
  - "returns 200 for valid input"          ← happy path
  - "returns 400 when email is missing"   ← error path
  - "returns 401 when token is expired"   ← auth error
  - "throws when dependency is down"      ← failure path
```

### AP-06: The Sleeper (Hard Sleep / Timing-Dependent)
Uses `time.sleep()` or `setTimeout()` instead of proper waits.

```typescript
// ❌ ANTI-PATTERN: Fixed sleep — fragile and slow
await page.click('#submit');
await new Promise(r => setTimeout(r, 3000));  // hope it loaded by now
await page.click('#next-step');

// ✅ CORRECT: Wait for the actual condition
await page.click('#submit');
await page.waitForSelector('#next-step', { state: 'visible' });
await page.click('#next-step');
```

### AP-07: The Narcissist (Testing Framework Behavior)
Tests that verify the testing framework or language built-ins work.

```python
# ❌ ANTI-PATTERN: Testing Python, not your code
def test_list_append():
    lst = []
    lst.append(1)
    assert len(lst) == 1   # testing Python's list, not your code

def test_mock_called():
    mock = MagicMock()
    mock()
    mock.assert_called_once()  # testing MagicMock behavior
```

### AP-08: The Pollution (Test Data Leakage)
Tests leave behind data (DB records, files, env vars) that affect other tests.

**Detection:** Run tests in different order — if results change, you have pollution.

```python
# ❌ ANTI-PATTERN: No cleanup
def test_create_user():
    create_user(email="alice@example.com")
    # no cleanup — next test that checks for unique email will fail

# ✅ CORRECT: Use fixtures with teardown or transactions
@pytest.fixture(autouse=True)
def cleanup(db_session):
    yield
    db_session.rollback()  # or db_session.execute("DELETE FROM users WHERE ...")
```

### AP-09: The Coward (Trivial Coverage Gaming)
Writing simple tests to inflate coverage % without testing meaningful behavior.

**Detection:** High coverage % but bugs still reach production.

```python
# ❌ ANTI-PATTERN: Only testing the obvious
def test_user_has_email():
    user = User(email="alice@example.com")
    assert user.email == "alice@example.com"  # tests the constructor

# MISSING: Tests for email uniqueness, format validation, case sensitivity,
#          update behavior, delete cascade, etc.
```

### AP-10: The Brittle Selector (E2E Only)
E2E tests that use fragile CSS selectors or XPath that break on UI changes.

```typescript
// ❌ ANTI-PATTERN: Fragile selectors
await page.click('div.container > div:nth-child(2) > button.btn-primary');
await page.click('//button[@class="btn btn-primary btn-lg"]');

// ✅ CORRECT: Semantic / test-specific selectors
await page.click('[data-testid="submit-order-btn"]');
await page.getByRole('button', { name: 'Submit Order' }).click();
```

---

## Coverage Audit Framework

Code coverage % is not real coverage. Use this audit to assess true quality:

### Step 1: Count Meaningful Assertions
```
For each test file:
  - Count tests with 0 assertions     → Liars
  - Count tests with only 1 assertion → Likely incomplete
  - Count tests mocking the thing they assert → Tautologies

Score: (tests with ≥ 2 meaningful assertions) / total tests
Target: ≥ 85%
```

### Step 2: Error Path Coverage
```
For each function/endpoint:
  - List all possible error conditions (from code)
  - Check if each has a test
  
Score: (tested error conditions) / (total error conditions)
Target: ≥ 80% for P1 features
```

### Step 3: Mutation Testing (Gold Standard)
Introduce deliberate bugs into the code — check if tests catch them.

```bash
# Python — mutmut
pip install mutmut
mutmut run --paths-to-mutate=src/
mutmut results

# JavaScript — Stryker
npx stryker run
# Good mutation score: ≥ 75%
```

### Step 4: Independence Check
```bash
# Run tests in random order
pytest --randomly-seed=random
# or
jest --randomize

# If tests fail only in certain order → not independent
```

---

## Verification-Before-Completion Gate

Before marking any story or feature as "Done", verify all gates pass:

```
COMPLETION GATE CHECKLIST

Code:
[ ] All acceptance criteria have at least one automated test
[ ] No anti-patterns detected (run this skill on the test code)
[ ] Tests pass in CI (not just local)
[ ] Tests pass in random order (--randomly-seed or --randomize)

Coverage:
[ ] Line coverage ≥ 80% for new code
[ ] Error paths tested for all new endpoints/functions
[ ] Boundary values tested for all inputs

Manual:
[ ] Exploratory session completed (if UI feature)
[ ] UAT script executed and signed off (if customer-facing)

Security:
[ ] No hardcoded secrets (grep for key/password/token in new code)
[ ] Input validation tested for new endpoints
[ ] Auth checks tested for new endpoints

Quality:
[ ] No Liar tests (AP-01)
[ ] No hard sleeps (AP-06)
[ ] No brittle selectors (AP-10)
[ ] Test names describe behavior (not just "it works")

If ANY item is unchecked → not Done. Add task to fix before merge.
```

---

## Review Output Format

When reviewing a test suite, output this report:

```markdown
## Test Quality Review Report

**File / Suite Reviewed:** [file or module]
**Review Date:** [date]
**Reviewer:** AI QA Agent

### Summary
- Total tests: [N]
- Tests with issues: [N]
- Coverage estimate (real): [%]
- Overall quality: 🟢 Good / 🟡 Needs Work / 🔴 Significant Issues

### Findings

| ID | Anti-Pattern | Location | Severity | Recommendation |
|---|---|---|---|---|
| F-001 | AP-01 Liar | test_auth.py:45 | High | Add assertion on return value |
| F-002 | AP-06 Sleeper | login.spec.ts:23 | Medium | Replace sleep(2000) with waitForSelector |

### Missing Test Cases
| Scenario | Why Missing | Priority |
|---|---|---|
| Login with expired token | Not tested | P1 |
| Password with special chars | Not tested | P2 |

### Positive Observations
- [What is done well in this suite]

### Recommendations
1. [Prioritized list of actions]
```

## References

- `references/anti-patterns-catalog.md` — full 15+ anti-pattern reference
- `references/mutation-testing-guide.md` — mutmut + Stryker setup guide
- `assets/templates/review-report.md` — blank review report template
- `assets/templates/completion-gate.md` — verification-before-completion checklist
