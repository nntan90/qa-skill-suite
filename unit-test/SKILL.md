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
  version: '2.0'
---

# Unit Test Skill
## ISTQB Component + Integration Testing Aligned

## When to Use This Skill

- User provides code (function/class/module) and asks for tests
- User wants to improve coverage on existing code
- User is doing TDD (test-first)
- User needs integration tests between modules or services
- User wants mutation testing or anti-pattern detection on existing tests

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

## References

- `references/pytest-cheatsheet.md` — fixtures, marks, plugins
- `references/jest-cheatsheet.md` — matchers, mocks, timers
- `references/junit5-cheatsheet.md` — JUnit 5 annotations, Mockito
- `assets/templates/unit-test-checklist.md` — pre-test planning checklist
