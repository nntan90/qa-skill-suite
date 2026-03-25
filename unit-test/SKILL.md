---
name: unit-test
description: >
  Write unit tests and integration tests for any language or framework. Load when asked to
  write tests for a function, class, module, or service. Supports pytest, Jest, Vitest,
  JUnit 5, xUnit, RSpec, Go testing, Mocha, TestNG, and more. Generates test code with
  AAA pattern, mocking strategies, parameterized tests, snapshot tests, BDD-style tests,
  and coverage gap analysis. Includes anti-pattern detection and verification-before-
  completion gate. Trigger phrases: "write unit tests", "test this function", "add tests",
  "mock this dependency", "TDD", "integration test", "snapshot test", "test coverage",
  "component test", "SDET", "pytest", "Jest", "JUnit".
metadata:
  author: qa-skill-suite
  version: '4.0'
---

# Unit Test Skill
## ISTQB Component + Integration Testing Aligned

## When to Use This Skill

- User provides code (function/class/module) and asks for tests
- User wants to improve coverage on existing code
- User is doing TDD (test-first)
- User needs integration tests between modules or services
- User wants mutation testing or anti-pattern detection on existing tests

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

**BEFORE writing tests, the agent MUST collect ALL mandatory fields. Ask for missing ones.**

```yaml
INPUT REQUIRED:
  # --- Mandatory ---
  code:                   # The function / class / module to test.
                          # Paste the actual source code. If TDD: paste the interface/signature.

  language:               # python | javascript | typescript | java | go | csharp | ruby | kotlin
                          # If omitted: detect from code syntax.

  # --- Strongly Recommended ---
  framework:              # pytest | jest | vitest | junit5 | xunit | rspec | go_test | mocha
                          # If omitted: agent selects best fit for language.

  dependencies:           # What external dependencies exist? List them:
                          # e.g., [database, http_client, email_service, file_system, redis]
                          # Used to determine what to mock.

  context:                # Brief description of what the code does and why.
                          # e.g., "Calculates shipping cost based on weight and destination"

  # --- Optional ---
  test_mode:              # unit | integration | both
                          # Default: unit

  existing_tests:         # Paste existing test code to detect gaps / anti-patterns.

  coverage_target:        # Minimum coverage to achieve. Default: 80%

  special_cases:          # Known edge cases to cover, e.g.:
                          # ["empty cart", "negative quantity", "international address"]

  style:                  # aaa (Arrange/Act/Assert) | bdd (Given/When/Then)
                          # Default: aaa
```

**If user pastes code without context:** read the code, infer intent, state assumptions before writing tests.

---

## Output Contract

**The agent MUST produce ALL sections below. No section is optional.**

> *"Before I call any test suite 'done', I check three things: does it catch real bugs, does it cover the edge cases, and will it still pass next week when someone changes the code? If any answer is no, it's not done."*


### Section 1 — Analysis Summary
```
Unit Under Test:    [function/class name]
Language:           [language + version if detectable]
Framework:          [test framework]
Dependencies:       [list of deps to mock]
Test Mode:          unit | integration | both
Complexity:         [low/medium/high] — determines how many tests to generate
```

### Section 2 — Test Plan (before code)
List every test case BEFORE writing code. Agent must not skip this.

| # | Test Name | Category | Technique | Mocks Needed |
|---|---|---|---|---|
| 1 | test_[method]_[state]_[expected] | happy / error / boundary | EP/BVA/error | [dep1, dep2] |

**Mandatory coverage grid — agent must generate test for each row:**
| Category | Min Tests | What to Cover |
|---|---|---|
| Happy Path | ≥ 2 | Typical valid input(s) |
| BVA — Boundary | ≥ 4 | min, min-1, max, max+1 for each range |
| EP — Null/Empty | ≥ 1 | None / null / "" / 0 / [] |
| EP — Wrong Type | ≥ 1 | String where int expected, etc. |
| Error Path | ≥ 1 per dep | Each mocked dependency throws exception |
| Error Path | ≥ 1 | Each mocked dependency returns bad data |
| State Transition | ≥ 1 per transition | If stateful object |

### Section 3 — Test File (complete, runnable)
```[language]
# Full file with:
# - All imports (real paths)
# - All fixtures / setup
# - All test functions following plan above
# - Comments explaining non-obvious logic
# - EVERY test has ≥ 2 assertions
```

### Section 4 — Test Summary Table
| Test Name | Covers | Technique | Status |
|---|---|---|---|
| test_[name] | [what behavior] | EP/BVA/mock | ✅ Generated |

### Section 5 — Coverage Gap Report
```
Generated:  [N] tests
Estimated line coverage:   ~[N]%
Estimated branch coverage: ~[N]%

NOT covered (explain each):
  - [branch/scenario]: [reason]

Recommendation:
  - [what to add next]
```

### Section 6 — Anti-Pattern Check
After writing, self-review each test:
```
[ ] No test has 0 assertions (AP-01 Liar)
[ ] No test asserts a constant or a mock return value (AP-02 Tautology)
[ ] No test depends on another test's state (AP-03 Wet Floor)
[ ] No test only calls mock.assert_called() without testing logic (AP-04 Mockery)
[ ] Error paths tested (not just happy path) (AP-05 Optimist)
[ ] No time.sleep() or setTimeout() (AP-06 Sleeper)
[ ] Tests pass if run in random order
```

---

## Workflow

1. **Detect stack** — language, test framework, assertion library, mock library
2. **Read the code** — understand inputs, outputs, side effects, dependencies
3. **Run anti-pattern check** — if reviewing existing tests (see `qa/test-review`)
4. **Plan test cases** — EP + BVA + error paths + state transitions
5. **Generate test code** — using correct framework template
6. **Add mocking** — mock all external I/O (DB, HTTP, file, time, env)
7. **Verify completeness** — run completion gate before saying "done"

## Test Case Planning Matrix

```
Unit Under Test: [name]
Language/Framework: ___________
Dependencies to mock: [DB | HTTP | File | Time | Env | Other services]

Test Cases:
✅ Happy path 1 — valid typical input
✅ Happy path 2 — valid alternate input
✅ BVA — minimum valid value
✅ BVA — maximum valid value
✅ BVA — just below minimum (invalid)
✅ BVA — just above maximum (invalid)
✅ EP — empty / null / None / ""
✅ EP — wrong type input
✅ Error path — dependency throws exception
✅ Error path — dependency returns unexpected format
✅ State transition — if stateful: each valid state change
```

## Framework Selection

| Language | Unit Framework | Integration | Mocking | BDD |
|---|---|---|---|---|
| Python | pytest | pytest + fixtures | pytest-mock / unittest.mock | Behave |
| JavaScript | Jest / Vitest | Jest | jest.mock / msw | Jest-Cucumber |
| TypeScript | Jest / Vitest | Jest + Supertest | jest.mock | Jest-Cucumber |
| Java | JUnit 5 | Spring Boot Test | Mockito | Cucumber-JVM |
| C# | xUnit / NUnit | WebApplicationFactory | Moq / NSubstitute | SpecFlow |
| Go | testing + testify | testcontainers-go | - | Godog |
| Ruby | RSpec | RSpec + rack-test | RSpec mocks | Cucumber |
| Kotlin | JUnit 5 + Kotest | Spring Boot Test | MockK | Cucumber-JVM |

## Mocking Strategy

| Dependency | Python | JavaScript/TS | Java |
|---|---|---|---|
| HTTP call | `respx` / `responses` | `msw` / `jest.mock` | WireMock / `@MockBean` |
| Database | `pytest-mock` + fixture | `jest.mock` | `@DataJpaTest` + H2 |
| File system | `tmp_path` fixture | `jest.spyOn(fs)` | `@TempDir` |
| Time/Date | `freezegun` | `jest.useFakeTimers()` | `Clock.fixed()` |
| Env vars | `monkeypatch.setenv` | `process.env` | `System.setProperty` |
| Other service | `MagicMock` | `jest.fn()` | `Mockito.mock()` |

## Code Patterns by Language

### Pattern 1: Basic Happy Path (Python/pytest)

```python
def test_calculate_discount_vip_user_returns_20_percent():
    # Arrange
    user  = User(tier="vip")
    price = 100.0

    # Act
    result = calculate_discount(user, price)

    # Assert
    assert result == 80.0
    assert isinstance(result, float)
```

### Pattern 2: Basic Happy Path (TypeScript/Jest or Vitest)

```typescript
describe('calculateDiscount', () => {
  it('applies 20% discount for VIP users', () => {
    // Arrange
    const user: User = { tier: 'vip' };

    // Act
    const result = calculateDiscount(user, 100);

    // Assert
    expect(result).toBe(80);
    expect(result).toBeCloseTo(80, 2);
  });
});
```

### Pattern 3: Mocked Dependency (Python)

```python
def test_send_welcome_email_calls_service_with_correct_params(mocker):
    # Arrange
    mock_send = mocker.patch('app.services.email.send')
    user = User(name='Alice', email='alice@example.com')

    # Act
    send_welcome_email(user)

    # Assert
    mock_send.assert_called_once_with(
        to='alice@example.com',
        subject='Welcome, Alice!',
        template='welcome'
    )
```

### Pattern 4: Mocked Dependency (TypeScript/Jest)

```typescript
jest.mock('../services/emailService');
import { send } from '../services/emailService';

it('sends welcome email to new user', async () => {
  const mockSend = send as jest.Mock;
  mockSend.mockResolvedValue({ sent: true });

  await sendWelcomeEmail({ name: 'Alice', email: 'alice@example.com' });

  expect(mockSend).toHaveBeenCalledWith({
    to: 'alice@example.com',
    subject: 'Welcome, Alice!',
    template: 'welcome',
  });
});
```

### Pattern 5: Parameterized / Table-Driven Tests

```python
# Python
@pytest.mark.parametrize("email,expected", [
    ("user@example.com", True),
    ("user@example",     False),
    ("",                 False),
    ("@example.com",     False),
    ("user@.com",        False),
    ("a" * 320 + "@example.com", False),   # BVA: too long
])
def test_validate_email(email, expected):
    assert validate_email(email) == expected
```

```typescript
// TypeScript
test.each([
  ['user@example.com', true],
  ['user@example',     false],
  ['',                 false],
  ['@example.com',     false],
])('validateEmail("%s") → %s', (email, expected) => {
  expect(validateEmail(email)).toBe(expected);
});
```

```java
// Java JUnit 5
@ParameterizedTest
@CsvSource({
    "user@example.com, true",
    "user@example,     false",
    ",                 false",
})
void validateEmail_variousInputs(String email, boolean expected) {
    assertEquals(expected, EmailValidator.validate(email));
}
```

### Pattern 6: Exception / Error Testing

```python
def test_divide_by_zero_raises_value_error():
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)

def test_fetch_nonexistent_user_raises_not_found(mocker):
    mocker.patch('app.db.get_user', side_effect=UserNotFoundError("User 999 not found"))
    with pytest.raises(UserNotFoundError):
        get_user_profile(user_id=999)
```

```typescript
it('throws ValueError when dividing by zero', () => {
  expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
});

it('throws UserNotFoundError for unknown user', async () => {
  jest.spyOn(db, 'getUser').mockRejectedValue(new UserNotFoundError('Not found'));
  await expect(getUserProfile(999)).rejects.toThrow(UserNotFoundError);
});
```

### Pattern 7: Async Tests

```python
@pytest.mark.asyncio
async def test_async_fetch_returns_user(mocker):
    mocker.patch('app.http.get', return_value={"id": "abc", "name": "Alice"})
    result = await fetch_user("abc")
    assert result.id   == "abc"
    assert result.name == "Alice"
```

```typescript
it('fetches user by id', async () => {
  jest.spyOn(httpClient, 'get').mockResolvedValue({ id: 'abc', name: 'Alice' });
  const result = await fetchUser('abc');
  expect(result.id).toBe('abc');
  expect(result.name).toBeDefined();
});
```

### Pattern 8: Integration Test (Real DB)

```python
@pytest.fixture
def db(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path}/test.db")
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

def test_create_and_retrieve_user(db):
    # Arrange + Act
    user = User(name="Alice", email="alice@example.com")
    db.add(user)
    db.commit()

    # Assert
    found = db.query(User).filter_by(email="alice@example.com").first()
    assert found is not None
    assert found.name == "Alice"
    assert found.id   is not None
```

### Pattern 9: BDD / Gherkin Style (Behave / pytest-bdd)

```gherkin
# features/discount.feature
Feature: Discount Calculation

  Scenario Outline: Apply tier-based discounts
    Given a user with tier "<tier>"
    When they purchase an item worth <price>
    Then the final price should be <expected>

    Examples:
      | tier     | price | expected |
      | vip      | 100   | 80       |
      | premium  | 100   | 90       |
      | standard | 100   | 100      |
```

```python
# features/steps/discount_steps.py
@given('a user with tier "{tier}"')
def step_given_user(context, tier):
    context.user = User(tier=tier)

@when('they purchase an item worth {price:d}')
def step_when_purchase(context, price):
    context.result = calculate_discount(context.user, price)

@then('the final price should be {expected:d}')
def step_then_price(context, expected):
    assert context.result == expected
```

### Pattern 10: Java / JUnit 5 + Mockito

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private PaymentGateway paymentGateway;

    @InjectMocks
    private OrderService orderService;

    @Test
    void processOrder_withValidPayment_completesOrder() {
        // Arrange
        Order order = new Order(100.0, "USD");
        when(paymentGateway.charge(any())).thenReturn(new PaymentResult(SUCCESS));

        // Act
        OrderResult result = orderService.processOrder(order);

        // Assert
        assertEquals(COMPLETED, result.getStatus());
        verify(paymentGateway, times(1)).charge(argThat(
            charge -> charge.getAmount().equals(100.0)
        ));
    }

    @Test
    void processOrder_whenPaymentFails_throwsPaymentException() {
        when(paymentGateway.charge(any())).thenThrow(new PaymentException("Declined"));
        assertThrows(PaymentException.class,
            () -> orderService.processOrder(new Order(100.0, "USD")));
    }
}
```

## Output Format

Always output:
1. **Test file** — complete, runnable, all imports present
2. **Test summary table** — what each test covers
3. **Coverage gaps** — explicitly list uncovered branches

## Completion Gate (from qa/test-review)

Before saying "tests are done", verify:
```
[ ] ≥ 1 test per behavior (not per line of code)
[ ] All tests have ≥ 1 meaningful assertion
[ ] No AP-01 Liars (test with no assertion)
[ ] No AP-06 Sleepers (hard sleeps)
[ ] Tests run in < 100ms each (mock all I/O)
[ ] Tests pass in random order
[ ] Error paths covered for all external calls
```

---

## Advanced Testing Patterns

### Pattern 1: Test Doubles — The Full Taxonomy (Martin Fowler)

Test doubles replace real dependencies during testing. There are 5 types. Use the RIGHT one — over-mocking is a common mistake.

| Type | What it does | When to use | Risk if overused |
|---|---|---|---|
| Dummy | Passed around but never used | Required params that don't affect the test | None — very safe |
| Stub | Returns a fixed value | Control what a dependency returns | Test can pass even if real code breaks |
| Spy | Records calls + optionally delegates to real | Verify HOW many times / with what args | Couples test to implementation detail |
| Mock | Pre-programmed with expectations, verified at end | Verify interaction protocol strictly | Brittle — breaks on any refactor |
| Fake | Simplified real implementation (e.g., in-memory DB) | Integration-like test without real infra | Must stay in sync with real implementation |

**Decision rule:**
```
Need to control what a dep returns?          → Stub
Need to verify how a dep was called?         → Spy (check after) or Mock (check during)
Need realistic but fast alternative?         → Fake
Just need to satisfy a required parameter?   → Dummy
```

**Python (pytest) examples:**
```python
from unittest.mock import MagicMock, patch, call

# STUB — control what the dependency returns
def test_get_user_returns_username():
    user_repo = MagicMock()
    user_repo.find_by_id.return_value = {"id": 1, "name": "Alice"}
    service = UserService(user_repo)
    result = service.get_display_name(1)
    assert result == "Alice"

# SPY — record calls, check after
def test_email_sent_once_on_registration():
    email_sender = MagicMock()
    service = RegistrationService(email_sender)
    service.register("alice@example.com", "password123")
    email_sender.send.assert_called_once()  # verify it was called exactly once
    args = email_sender.send.call_args
    assert args[0][0] == "alice@example.com"  # verify correct email address

# MOCK — strict expectation, verified automatically
def test_audit_log_records_user_action():
    audit_log = MagicMock()
    audit_log.record.expect_call("USER_LOGIN", user_id=42)  # set expectation
    service = AuthService(audit_log)
    service.login(user_id=42)
    audit_log.record.assert_called_with("USER_LOGIN", user_id=42)

# FAKE — in-memory implementation
class InMemoryUserRepo:
    def __init__(self):
        self._store = {}
    def save(self, user):
        self._store[user["id"]] = user
    def find_by_id(self, user_id):
        return self._store.get(user_id)

def test_user_saved_and_retrieved():
    repo = InMemoryUserRepo()
    repo.save({"id": 1, "name": "Bob"})
    result = repo.find_by_id(1)
    assert result["name"] == "Bob"
```

**TypeScript (Jest) examples:**
```typescript
// STUB
const mockRepo = { findById: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' }) };
const service = new UserService(mockRepo as any);
const name = await service.getDisplayName(1);
expect(name).toBe('Alice');

// SPY
const emailSpy = jest.spyOn(emailService, 'send');
await registrationService.register('alice@example.com', 'password123');
expect(emailSpy).toHaveBeenCalledTimes(1);
expect(emailSpy).toHaveBeenCalledWith('alice@example.com', expect.any(String));

// FAKE — in-memory repository
class InMemoryUserRepository implements UserRepository {
  private store = new Map<number, User>();
  async save(user: User): Promise<void> { this.store.set(user.id, user); }
  async findById(id: number): Promise<User | null> { return this.store.get(id) ?? null; }
}
```

---

### Pattern 2: TDD — Red / Green / Refactor Cycle

TDD means you write the test BEFORE the code. This forces you to think about the interface first.

**The 3-step cycle:**
```
RED    → Write a failing test. The code does not exist yet. Test must fail.
GREEN  → Write the MINIMUM code to make the test pass. No extras.
REFACTOR → Clean up the code. Tests must still pass after refactor.
```

**Why it matters:** I've seen teams skip TDD and end up with code that's hard to test later. If your code is hard to test, it's usually badly designed. Tests are a design tool.

**Example — building a password validator step by step:**

Step 1 — RED: Write failing test first
```python
# test_password_validator.py
def test_password_too_short_is_rejected():
    result = validate_password("abc")        # function does not exist yet
    assert result.is_valid == False
    assert "8 characters" in result.error    # test fails — ImportError

def test_password_minimum_8_chars_is_accepted():
    result = validate_password("abcd1234")
    assert result.is_valid == True

def test_password_must_contain_number():
    result = validate_password("abcdefgh")   # 8 chars but no number
    assert result.is_valid == False
    assert "number" in result.error
```

Step 2 — GREEN: Minimum code to pass
```python
# password_validator.py
from dataclasses import dataclass

@dataclass
class ValidationResult:
    is_valid: bool
    error: str = ""

def validate_password(password: str) -> ValidationResult:
    if len(password) < 8:
        return ValidationResult(False, "Password must be at least 8 characters")
    if not any(c.isdigit() for c in password):
        return ValidationResult(False, "Password must contain at least one number")
    return ValidationResult(True)
```

Step 3 — REFACTOR: Improve without breaking tests
```python
def validate_password(password: str) -> ValidationResult:
    errors = []
    if len(password) < 8:
        errors.append("at least 8 characters")
    if not any(c.isdigit() for c in password):
        errors.append("at least one number")
    if not any(c.isupper() for c in password):
        errors.append("at least one uppercase letter")
    if errors:
        return ValidationResult(False, f"Password must contain: {', '.join(errors)}")
    return ValidationResult(True)
```

**TDD anti-patterns to avoid:**
| Anti-pattern | Problem | Fix |
|---|---|---|
| Writing tests AFTER code | Tests just verify what code already does, not what it SHOULD do | Commit to test-first on new functions |
| Skipping the RED step | If test passes before code is written, test is wrong | Always run the test first and confirm it fails |
| Writing too much code in GREEN | Adds untested code | Write only what makes the test pass |
| Not refactoring | Technical debt grows | Always do step 3 |

---

### Pattern 3: Property-Based Testing (PBT)

Instead of testing specific values, you define PROPERTIES that must always be true. The framework generates hundreds of random inputs automatically.

**When to use:** Functions with mathematical properties, data transformations, serialization/deserialization, any function where "for all inputs of type X, property Y must hold."

**Python — Hypothesis framework:**
```python
from hypothesis import given, strategies as st
import pytest

# EXAMPLE-BASED (traditional) — only tests 3 cases
def test_add_numbers_traditional():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

# PROPERTY-BASED — tests hundreds of cases automatically
@given(st.integers(), st.integers())
def test_add_is_commutative(a, b):
    """Addition must be commutative: a+b == b+a. Always."""
    assert add(a, b) == add(b, a)

@given(st.integers())
def test_add_zero_identity(n):
    """Adding zero must not change the value. Always."""
    assert add(n, 0) == n

@given(st.text(min_size=1), st.text(min_size=1))
def test_string_concat_length(s1, s2):
    """Concatenated string length must equal sum of both lengths. Always."""
    result = concat(s1, s2)
    assert len(result) == len(s1) + len(s2)

@given(st.lists(st.integers(), min_size=1))
def test_sort_is_idempotent(lst):
    """Sorting twice should give the same result as sorting once."""
    once = sorted(lst)
    twice = sorted(sorted(lst))
    assert once == twice

# Serialization round-trip property
@given(st.dictionaries(st.text(), st.integers()))
def test_json_roundtrip(data):
    """Serialize → deserialize must return the original data. Always."""
    import json
    assert json.loads(json.dumps(data)) == data
```

**TypeScript — fast-check framework:**
```typescript
import * as fc from 'fast-check';

// Property: reversing twice returns original
test('reverse is its own inverse', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      expect(reverse(reverse(arr))).toEqual(arr);
    })
  );
});

// Property: sorted array has no out-of-order elements
test('sort produces ordered array', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const sorted = mySort(arr);
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i]).toBeLessThanOrEqual(sorted[i + 1]);
      }
    })
  );
});
```

**Common property patterns:**
```
Commutativity:   f(a, b) == f(b, a)         → addition, union
Associativity:   f(f(a,b),c) == f(a,f(b,c)) → addition, string concat
Identity:        f(a, identity) == a         → add 0, multiply 1
Idempotency:     f(f(a)) == f(a)             → sort, deduplicate, normalize
Round-trip:      decode(encode(a)) == a      → serialization
Invariant:       size(f(a)) == size(a)       → map, transform
Monotonicity:    a <= b → f(a) <= f(b)       → any monotone function
```

---

### Pattern 4: Mutation Testing

Mutation testing checks if your tests can catch real bugs. It injects small bugs into your code ("mutants") and checks if any test fails. If tests pass with a mutant → your tests are too weak.

**How it works:**
```
1. Original code runs → all tests pass (baseline)
2. Tool creates "mutants" — small code changes:
   - Change > to >=
   - Change + to -
   - Delete a return statement
   - Change True to False
3. Run tests against each mutant
4. If a test FAILS → mutant is "killed" (good — test caught the bug)
5. If all tests PASS → mutant "survived" (bad — tests missed a real bug)

Mutation Score = (Killed Mutants / Total Mutants) × 100%
Target: > 80% mutation score
```

**Python — mutmut:**
```bash
# Install
pip install mutmut

# Run mutation testing
mutmut run --paths-to-mutate=src/

# View results
mutmut results
mutmut show 5   # show what mutant #5 looks like

# Example output:
# 🎉 12 out of 15 mutants killed (80%)
# Surviving mutants (these are your test gaps):
#   - Line 23: changed > to >= (your tests didn't catch it!)
```

**JavaScript — Stryker:**
```bash
# Install
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner

# stryker.config.json
{
  "testRunner": "jest",
  "mutate": ["src/**/*.js"],
  "reporters": ["html", "progress"]
}

# Run
npx stryker run

# Output shows mutation score per file
```

**What to do with surviving mutants:**
```
Surviving mutant: changed `if (age > 18)` to `if (age >= 18)`
→ Your test never tested age = 18 exactly
→ Add: assert validate_age(18) == True (boundary value)

Surviving mutant: deleted `return False` at end of function
→ Your test never checked the False return case
→ Add a test for the rejection path
```

---

### Pattern 5: Contract Testing (Consumer-Driven, Pact)

In microservices, service A depends on service B's API. Contract testing checks that both sides agree on the interface — without needing both services running at the same time.

**The two roles:**
- **Consumer** — the service that calls the API (writes the contract)
- **Provider** — the service that responds (verifies the contract)

**How Pact works:**
```
1. Consumer writes a test that says:
   "When I call POST /users with {name: Alice}, I expect 201 with {id: number}"
2. Pact generates a contract file (pact.json) from that test
3. Provider runs the contract file against its own code
4. If provider code returns what the contract says → PASS
5. If not → FAIL — breaking change detected before deployment
```

**Consumer test (Python):**
```python
import pytest
from pact import Consumer, Provider

pact = Consumer('UserService').has_pact_with(Provider('AuthService'))

def test_get_user_contract():
    # Define what we expect the provider to do
    (pact
     .given("user with id 1 exists")
     .upon_receiving("a request for user 1")
     .with_request("GET", "/users/1")
     .will_respond_with(
         200,
         body={"id": 1, "name": "Alice", "email": Like("alice@example.com")}
     ))
    
    with pact:
        result = user_client.get_user(1)  # calls the mock provider
        assert result["name"] == "Alice"
    # Pact saves the contract to pacts/userservice-authservice.json
```

**Provider verification (Python):**
```python
from pact import Verifier

def test_provider_honors_contract():
    verifier = Verifier(provider="AuthService", provider_base_url="http://localhost:8080")
    output, _ = verifier.verify_with_broker(
        broker_url="https://pact-broker.company.com",
        provider_states_setup_url="http://localhost:8080/pact/provider-states",
    )
    assert output == 0  # 0 = all contracts passed
```

**When to use contract testing vs integration testing:**
```
Integration test:   Both services must be running. Slow. Brittle. Hard to set up.
Contract test:      Each service tests independently. Fast. Catches breaking changes early.

Use contract testing when:
- You have microservices or separate frontend/backend teams
- You want to catch API breaking changes BEFORE they reach staging
- You deploy services independently

Do NOT replace integration tests — contract tests check interface agreement,
not business logic correctness.
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

- `references/pytest-cheatsheet.md` — fixtures, marks, plugins
- `references/jest-cheatsheet.md` — matchers, mocks, timers
- `references/junit5-cheatsheet.md` — JUnit 5 annotations, Mockito
- `assets/templates/unit-test-checklist.md` — pre-test planning checklist
