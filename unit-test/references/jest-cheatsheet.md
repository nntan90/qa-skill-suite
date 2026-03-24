# Jest / Vitest Cheatsheet

## Setup
```bash
# Jest
npm install --save-dev jest @types/jest ts-jest

# Vitest (preferred for Vite projects)
npm install --save-dev vitest @vitest/ui

# Testing Library (React)
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## Running Tests
```bash
npx jest                        # Run all tests
npx jest --watch                # Watch mode
npx jest --coverage             # With coverage
npx jest tests/auth.test.ts     # Specific file
npx jest -t "should login"      # Filter by test name
npx jest --onlyFailures         # Re-run failed tests
```

## Test Structure
```typescript
describe('Calculator', () => {
  beforeAll(() => { /* runs once before all tests */ });
  afterAll(() => { /* runs once after all tests */ });
  beforeEach(() => { /* runs before each test */ });
  afterEach(() => { /* runs after each test */ });

  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('throws on division by zero', () => {
    expect(() => divide(1, 0)).toThrow('Cannot divide by zero');
  });
});
```

## Matchers
```typescript
// Equality
expect(x).toBe(1)              // strict ===
expect(x).toEqual({ a: 1 })   // deep equality
expect(x).not.toBe(null)

// Truthiness
expect(x).toBeTruthy()
expect(x).toBeFalsy()
expect(x).toBeNull()
expect(x).toBeUndefined()
expect(x).toBeDefined()

// Numbers
expect(x).toBeGreaterThan(5)
expect(x).toBeLessThanOrEqual(10)
expect(x).toBeCloseTo(3.14, 2)  // 2 decimal places

// Strings
expect(str).toMatch(/pattern/)
expect(str).toContain('substring')
expect(str).toHaveLength(5)

// Arrays
expect(arr).toContain(item)
expect(arr).toHaveLength(3)
expect(arr).toEqual(expect.arrayContaining([1, 2]))

// Objects
expect(obj).toHaveProperty('key')
expect(obj).toHaveProperty('key', 'value')
expect(obj).toMatchObject({ name: 'Alice' })  // partial match

// Errors
expect(() => fn()).toThrow()
expect(() => fn()).toThrow(TypeError)
expect(() => fn()).toThrow('message')
expect(fn()).rejects.toThrow('async error')  // async
```

## Mocking
```typescript
// Mock a module
jest.mock('../services/emailService');
import { sendEmail } from '../services/emailService';
const mockSendEmail = sendEmail as jest.Mock;

test('calls email service', () => {
  mockSendEmail.mockResolvedValue({ sent: true });
  await notify('user@example.com');
  expect(mockSendEmail).toHaveBeenCalledWith({ to: 'user@example.com' });
});

// Spy on existing method
const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
// ...
expect(spy).toHaveBeenCalled();
spy.mockRestore();

// Mock return values
mock.mockReturnValue('value')           // sync
mock.mockResolvedValue('value')         // async (Promise.resolve)
mock.mockRejectedValue(new Error(''))   // async (Promise.reject)
mock.mockReturnValueOnce('first')       // only next call
mock.mockImplementation((x) => x * 2)  // custom implementation

// Reset mocks
jest.clearAllMocks()    // clears call history, instances
jest.resetAllMocks()    // clears + resets implementation
jest.restoreAllMocks()  // restores original (for spies)
```

## Fake Timers
```typescript
jest.useFakeTimers();

test('calls after delay', () => {
  const fn = jest.fn();
  setTimeout(fn, 1000);

  jest.advanceTimersByTime(1000);
  expect(fn).toHaveBeenCalledTimes(1);
});

afterEach(() => jest.useRealTimers());
```

## Parameterized Tests
```typescript
test.each([
  [1, 2, 3],
  [0, 0, 0],
  [-1, 1, 0],
])('add(%i, %i) = %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});

// Object form
test.each([
  { input: 'HELLO', expected: 'hello' },
  { input: 'World', expected: 'world' },
])('toLowerCase($input)', ({ input, expected }) => {
  expect(input.toLowerCase()).toBe(expected);
});
```

## Snapshot Tests
```typescript
it('renders correctly', () => {
  const { container } = render(<Button label="Click me" />);
  expect(container).toMatchSnapshot();
});

// Update snapshots:
// npx jest --updateSnapshot
```

## jest.config.ts
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',          // or 'jsdom' for browser
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: { lines: 80, branches: 75 },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterFramework: ['<rootDir>/tests/setup.ts'],
};

export default config;
```
