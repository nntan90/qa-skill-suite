---
name: e2e-test
description: >
  Write end-to-end browser tests and UI automation scripts. Load when asked to automate
  user flows, test UI interactions, write browser tests, or verify full-stack journeys.
  Supports Playwright (primary), Cypress, and Selenium WebDriver. Generates Page Object
  Model (POM) code, test fixtures, and CI configuration. Trigger phrases: "e2e test",
  "browser test", "automate user flow", "Playwright", "Cypress", "Selenium", "UI test",
  "end-to-end", "test the login flow", "automate this journey", "smoke test", "regression test".
metadata:
  author: qa-skill-builder
  version: '1.0'
---

# E2E Test Skill

## When to Use This Skill

- User wants to automate a user journey (login, checkout, signup, etc.)
- User says "write E2E tests", "Playwright test", "Cypress test"
- User wants smoke tests or regression tests for a web app
- User needs to set up a browser testing framework from scratch
- User wants to test responsive behavior or multi-browser compatibility

## Framework Priority

**Default: Playwright** (TypeScript) — best DX, multi-browser, built-in assertions, no flakiness.
Use Cypress when the user explicitly requests it or existing project uses Cypress.
Use Selenium only for Java projects or legacy requirements.

## Workflow

1. **Map the user journey** — identify every step a user takes (click, type, navigate, assert)
2. **Identify selectors** — prefer `data-testid`, then ARIA roles, then text, last CSS class
3. **Create Page Objects** — encapsulate UI interactions into reusable page classes
4. **Write test scenarios** — happy path first, then error flows
5. **Add fixtures** — auth state, seed data, API intercepts
6. **Configure CI** — add playwright.config.ts + GitHub Actions workflow
7. **Handle flakiness** — use `waitFor`, avoid hard sleeps, use network idle states

## Selector Priority (Best to Worst)

```
1. data-testid="submit-btn"          → Most stable, test-specific
2. role="button" name="Submit"       → Accessible, semantic
3. text="Submit"                     → Readable but fragile on i18n
4. .submit-button                    → CSS class — fragile
5. #submit                           → ID — better but still fragile
6. xpath=//button[@type='submit']    → Last resort
```

Always ask the dev team to add `data-testid` attributes to interactive elements.

## Page Object Model (POM) Pattern

### POM Base Structure

```typescript
// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}
```

```typescript
// pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput:    Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton:  Locator;
  private readonly errorMessage:  Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput    = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton  = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage  = page.getByTestId('error-message');
  }

  async goto() {
    await this.navigate('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Using POM in Tests

```typescript
// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('valid credentials redirect to dashboard', async ({ page }) => {
    await loginPage.login('user@example.com', 'correct-password');
    await expect(page).toHaveURL('/dashboard');
    await expect(dashboardPage.welcomeMessage).toContainText('Welcome');
  });

  test('invalid password shows error message', async () => {
    await loginPage.login('user@example.com', 'wrong-password');
    await loginPage.expectError('Invalid email or password');
  });

  test('empty fields show validation errors', async () => {
    await loginPage.login('', '');
    await loginPage.expectError('Email is required');
  });
});
```

## Authentication Fixtures (Reusable Auth State)

Avoid logging in on every test. Save auth state once and reuse.

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /global.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

```typescript
// tests/global.setup.ts
import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@example.com');
  await page.getByTestId('password-input').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: authFile });
});
```

## API Intercept / Network Mocking

```typescript
// Mock API response in E2E test
test('displays error when API fails', async ({ page }) => {
  // Intercept and override API response
  await page.route('/api/users', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal server error' }),
    });
  });

  await page.goto('/users');
  await expect(page.getByTestId('error-banner')).toBeVisible();
  await expect(page.getByTestId('error-banner')).toContainText('Something went wrong');
});

// Wait for specific API call and assert its response
test('checkout submits correct payload', async ({ page }) => {
  const [request] = await Promise.all([
    page.waitForRequest(req => req.url().includes('/api/orders') && req.method() === 'POST'),
    page.getByTestId('checkout-button').click(),
  ]);

  const body = JSON.parse(request.postData() ?? '{}');
  expect(body).toMatchObject({ items: expect.any(Array), total: expect.any(Number) });
});
```

## Complex Flow Patterns

### Pattern: Multi-Step Form / Wizard

```typescript
test('complete signup wizard', async ({ page }) => {
  // Step 1: Personal Info
  await page.goto('/signup');
  await page.getByTestId('first-name').fill('Alice');
  await page.getByTestId('last-name').fill('Smith');
  await page.getByTestId('next-step').click();

  // Step 2: Account Details
  await expect(page.getByTestId('step-indicator')).toContainText('Step 2');
  await page.getByTestId('email').fill('alice@example.com');
  await page.getByTestId('password').fill('Secure@Pass123');
  await page.getByTestId('next-step').click();

  // Step 3: Confirmation
  await expect(page.getByTestId('confirmation-email')).toContainText('alice@example.com');
  await page.getByTestId('submit-signup').click();

  // Verify completion
  await expect(page).toHaveURL('/signup/success');
  await expect(page.getByTestId('success-message')).toBeVisible();
});
```

### Pattern: File Upload

```typescript
test('uploads profile picture', async ({ page }) => {
  await page.goto('/profile/edit');
  const fileInput = page.getByTestId('avatar-upload');
  await fileInput.setInputFiles('tests/fixtures/test-avatar.png');
  await page.getByTestId('save-profile').click();
  await expect(page.getByTestId('avatar-image')).toBeVisible();
});
```

### Pattern: Drag and Drop

```typescript
test('reorders items by drag and drop', async ({ page }) => {
  await page.goto('/kanban');
  const source = page.getByTestId('card-item-1');
  const target = page.getByTestId('column-done');

  await source.dragTo(target);
  await expect(page.getByTestId('column-done')).toContainText('Task 1');
});
```

## Cypress Equivalent (when requested)

```javascript
// cypress/e2e/login.cy.js
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('valid credentials redirect to dashboard', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('correct-password');
    cy.get('[data-testid="submit-btn"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome');
  });

  it('invalid password shows error', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('wrong');
    cy.get('[data-testid="submit-btn"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

## CI Configuration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

## E2E Test Checklist

```
[ ] Happy path — complete user journey succeeds
[ ] Error recovery — user can correct mistakes and continue
[ ] Auth guard — unauthenticated users are redirected
[ ] Form validation — required fields, format errors shown
[ ] API failure handling — error states are displayed gracefully
[ ] Loading states — spinners/skeletons appear during async operations
[ ] Navigation — back button, breadcrumbs work correctly
[ ] Accessibility — interactive elements have accessible names
[ ] Mobile viewport — test at 375px width (optional)
[ ] No console errors during the test run
```

## References

- `references/playwright-locators.md` — all locator strategies and best practices
- `references/playwright-config.md` — config options, reporters, parallel runs
- `assets/templates/page-object-template.ts` — POM class template
- `assets/templates/playwright-config.ts` — production-ready config template
- `assets/templates/github-actions-e2e.yml` — CI workflow template
