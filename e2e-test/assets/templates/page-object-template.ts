// Page Object Template — copy and customize for each page
import { Page, Locator, expect } from '@playwright/test';

export class TemplatePage {
  // ─── Locators ────────────────────────────────────────────────────────────
  // Prefer: data-testid > role > text > CSS
  private readonly heading:       Locator;
  private readonly primaryButton: Locator;
  private readonly inputField:    Locator;
  private readonly errorMessage:  Locator;
  private readonly loadingSpinner: Locator;

  constructor(private readonly page: Page) {
    this.heading        = page.getByRole('heading', { level: 1 });
    this.primaryButton  = page.getByTestId('primary-action-btn');
    this.inputField     = page.getByTestId('main-input');
    this.errorMessage   = page.getByTestId('error-message');
    this.loadingSpinner = page.getByTestId('loading-spinner');
  }

  // ─── Navigation ──────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('/your-path-here');
    await this.waitForReady();
  }

  async waitForReady() {
    await this.loadingSpinner.waitFor({ state: 'hidden' });
    await this.heading.waitFor({ state: 'visible' });
  }

  // ─── Actions ─────────────────────────────────────────────────────────────
  async fillInput(value: string) {
    await this.inputField.clear();
    await this.inputField.fill(value);
  }

  async clickPrimary() {
    await this.primaryButton.click();
  }

  async submitForm(value: string) {
    await this.fillInput(value);
    await this.clickPrimary();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────
  async expectHeading(text: string) {
    await expect(this.heading).toContainText(text);
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectNoError() {
    await expect(this.errorMessage).toBeHidden();
  }

  async expectLoading() {
    await expect(this.loadingSpinner).toBeVisible();
  }

  async expectUrl(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }
}
