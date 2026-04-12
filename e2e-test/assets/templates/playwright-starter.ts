/**
 * Playwright E2E Test Starter Template
 * =====================================
 * A production-ready Playwright test file template with Page Object Model.
 * Replace [Feature] with your actual feature name.
 *
 * Usage:
 *   npx playwright test tests/feature.spec.ts
 *   npx playwright test --ui
 *   npx playwright test --headed
 */

import { test, expect, Page } from '@playwright/test';

// =============================================================================
// CONFIGURATION
// =============================================================================

const BASE_URL = process.env.BASE_URL || 'https://staging.example.com';

const TEST_USER = {
  email: 'test@example.com',
  password: 'test123',
};

// =============================================================================
// PAGE OBJECTS
// =============================================================================

class LoginPage {
  constructor(private page: Page) {}

  // Locators
  private emailInput = () => this.page.getByTestId('email-input');
  private passwordInput = () => this.page.getByTestId('password-input');
  private submitButton = () => this.page.getByTestId('login-button');
  private errorMessage = () => this.page.getByTestId('error-message');

  // Actions
  async goto() {
    await this.page.goto(`${BASE_URL}/login`);
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  async getErrorMessage() {
    return this.errorMessage().textContent();
  }

  // Assertions
  async expectToBeVisible() {
    await expect(this.emailInput()).toBeVisible();
  }
}

class DashboardPage {
  constructor(private page: Page) {}

  // Locators
  private welcomeMessage = () => this.page.getByTestId('welcome-message');
  private userMenu = () => this.page.getByTestId('user-menu');
  private logoutButton = () => this.page.getByTestId('logout-button');

  // Actions
  async goto() {
    await this.page.goto(`${BASE_URL}/dashboard`);
  }

  async logout() {
    await this.userMenu().click();
    await this.logoutButton().click();
  }

  // Assertions
  async expectToBeVisible() {
    await expect(this.welcomeMessage()).toBeVisible();
  }

  async expectWelcomeMessage(name: string) {
    await expect(this.welcomeMessage()).toContainText(`Welcome, ${name}`);
  }
}

// =============================================================================
// FIXTURES
// =============================================================================

// Custom fixture for authenticated state
test.describe.configure({ mode: 'serial' });

// =============================================================================
// HAPPY PATH TESTS
// =============================================================================

test.describe('Login Feature - Happy Path', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Wait for navigation
    await page.waitForURL('**/dashboard');

    // Verify dashboard is visible
    await dashboardPage.expectToBeVisible();
  });

  test('should display welcome message with user name', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard');

    await dashboardPage.expectWelcomeMessage('Test User');
  });

  test('should logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login first
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard');

    // Logout
    await dashboardPage.logout();

    // Verify redirect to login
    await page.waitForURL('**/login');
    await loginPage.expectToBeVisible();
  });
});

// =============================================================================
// ERROR PATH TESTS
// =============================================================================

test.describe('Login Feature - Error Handling', () => {
  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('test@example.com', 'wrongpassword');

    // Verify error message
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  test('should show error when email is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', TEST_USER.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Email is required');
  });

  test('should show error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_USER.email, '');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });
});

// =============================================================================
// NAVIGATION TESTS
// =============================================================================

test.describe('Navigation', () => {
  test('should redirect to login when accessing protected page', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Should redirect to login
    await page.waitForURL('**/login');
  });

  test('should preserve intended destination after login', async ({ page }) => {
    // Try to access protected page
    await page.goto(`${BASE_URL}/settings`);

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Should redirect to originally intended page
    await page.waitForURL('**/settings');
  });
});

// =============================================================================
// FORM VALIDATION TESTS
// =============================================================================

test.describe('Form Validation', () => {
  test('should validate email format', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid-email', TEST_USER.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid email format');
  });

  test('should enforce minimum password length', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_USER.email, '123');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password must be at least');
  });
});

// =============================================================================
// ACCESSIBILITY TESTS
// =============================================================================

test.describe('Accessibility', () => {
  test('should have proper focus management', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('email-input')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('password-input')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('login-button')).toBeFocused();
  });

  test('should submit form with Enter key', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill(TEST_USER.password);
    await page.keyboard.press('Enter');

    await page.waitForURL('**/dashboard');
  });
});

// =============================================================================
// RESPONSIVE TESTS
// =============================================================================

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify mobile layout
    await loginPage.expectToBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.expectToBeVisible();
  });
});

// =============================================================================
// VISUAL REGRESSION (Screenshot Comparison)
// =============================================================================

test.describe('Visual Regression', () => {
  test('login page should match snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixels: 100,
    });
  });
});
