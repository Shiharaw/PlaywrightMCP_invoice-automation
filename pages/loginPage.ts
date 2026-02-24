import { Page, expect } from '@playwright/test';
import { getBaseUrl } from '../config/config';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: ReturnType<Page['locator']>;
  readonly passwordInput: ReturnType<Page['locator']>;
  readonly signInButton: ReturnType<Page['getByRole']>;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"], input[aria-label*="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name*="password"], input[placeholder*="password"], input[aria-label*="password"]');
    this.signInButton = page.getByRole('button', { name: /sign in/i });
  }

  async goto() {
    const base = getBaseUrl();
    // retry once on transient network errors
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await this.page.goto(`${base}/login`);
        return;
      } catch (e) {
        if (attempt === 1) throw e;
        // small backoff then retry
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async login(email: string, password: string) {
    await expect(this.page.getByText('Welcome Back')).toBeVisible();
    await expect(this.emailInput.first()).toBeVisible({ timeout: 5000 });
    await this.emailInput.first().fill(email);
    await expect(this.passwordInput.first()).toBeVisible({ timeout: 5000 });
    await this.passwordInput.first().fill(password);
    await this.signInButton.click();
  }

  async expectDashboard(timeout = 5000) {
    await expect(this.page.locator('text=Dashboard').first()).toBeVisible({ timeout });
  }
}