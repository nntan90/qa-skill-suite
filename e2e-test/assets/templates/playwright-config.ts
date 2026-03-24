// playwright.config.ts — Production-ready configuration template
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is accidentally left in
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI to avoid resource exhaustion
  workers: process.env.CI ? 4 : undefined,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    process.env.CI ? ['github'] : ['dot'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for page.goto('/')
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace on first retry (for debugging)
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Global timeout for each action (click, fill, etc.)
    actionTimeout: 10_000,

    // Global timeout for navigation
    navigationTimeout: 30_000,
  },

  // Test timeout
  timeout: 60_000,

  // Expect timeout
  expect: {
    timeout: 10_000,
  },

  // Browser projects
  projects: [
    // Setup project — runs global.setup.ts first
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    // Chrome — main browser
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Firefox
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Mobile Chrome (optional)
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Tests that don't need auth (login page, public pages)
    {
      name: 'unauthenticated',
      testMatch: /.*\.unauthenticated\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start dev server before running tests (optional)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120_000,
  // },
});
