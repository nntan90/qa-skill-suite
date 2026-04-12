# QA Skill Suite Examples

This folder contains example test suites demonstrating how to use the QA Skill Suite skills in practice.

## E-Commerce Suite Example

A complete testing suite for an e-commerce application, demonstrating all testing types.

### Structure

```
e-commerce-suite/
├── unit/                   # Unit tests (qa/unit-test)
│   ├── cart.test.ts       # Shopping cart logic
│   └── pricing.test.ts    # Pricing calculations
│
├── api/                    # API tests (qa/api-test)
│   ├── products.test.ts   # Product endpoints
│   └── orders.test.ts     # Order endpoints
│
├── e2e/                    # E2E tests (qa/e2e-test)
│   ├── checkout.spec.ts   # Checkout flow
│   └── search.spec.ts     # Search functionality
│
├── performance/            # Performance tests (qa/performance-test)
│   ├── load-test.js       # k6 load test
│   └── stress-test.js     # k6 stress test
│
└── security/               # Security tests (qa/security-test)
    └── owasp-checks.md    # Security checklist
```

## How to Use These Examples

### 1. Unit Tests

Generate similar tests using:
```
Use qa/unit-test skill to write unit tests for shopping cart
with add item, remove item, and calculate total functions
```

### 2. API Tests

Generate similar tests using:
```
Use qa/api-test skill to write API tests for POST /api/orders
endpoint with authentication and validation
```

### 3. E2E Tests

Generate similar tests using:
```
Use qa/e2e-test skill to create Playwright tests for the
checkout flow with Page Object Model
```

### 4. Performance Tests

Generate similar tests using:
```
Use qa/performance-test skill to create k6 load test for
/api/products endpoint with 500 concurrent users
```

### 5. Security Tests

Generate similar tests using:
```
Use qa/security-test skill to review the checkout process
for OWASP Top 10 vulnerabilities
```

## Running the Examples

### Prerequisites

```bash
# Install dependencies
npm install

# For Python examples
pip install pytest httpx
```

### Run Unit Tests

```bash
npm test -- --testPathPattern=unit
```

### Run API Tests

```bash
npm test -- --testPathPattern=api
```

### Run E2E Tests

```bash
npx playwright test e2e/
```

### Run Performance Tests

```bash
k6 run performance/load-test.js
```

## Skill Usage Prompts

Each example includes comments showing the prompt used to generate it:

```typescript
/**
 * Generated with qa/unit-test skill
 * Prompt: "Write Jest unit tests for a shopping cart module
 *          with add, remove, clear, and calculateTotal functions.
 *          Cart should handle quantity updates and apply discounts."
 */
```

## Contributing Examples

To add a new example:

1. Create a folder for your use case
2. Add test files demonstrating each relevant skill
3. Include the prompt used in file comments
4. Update this README with the new example
5. Submit a PR following CONTRIBUTING.md guidelines
