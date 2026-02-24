import { Page, expect, Locator } from '@playwright/test';
import { getBaseUrl } from '../config/config';

export class EnhancedLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly googleSignInButton: Locator;
  readonly welcomeBackHeading: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"], input[aria-label*="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name*="password"], input[placeholder*="password"], input[aria-label*="password"]');
    this.signInButton = page.getByRole('button', { name: /^sign in$/i });
    this.googleSignInButton = page.getByRole('button', { name: /continue with google|sign in with google|google/i });
    this.welcomeBackHeading = page.getByRole('heading', { name: /welcome back/i });
    this.signUpLink = page.getByText(/sign up/i);
  }

  async goto() {
    const base = getBaseUrl();
    console.log(`Navigating to: ${base}/login`);
    
    // retry once on transient network errors
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await this.page.goto(`${base}/login`);
        await this.waitForPageLoad();
        return;
      } catch (e) {
        if (attempt === 1) throw e;
        console.log(`Navigation attempt ${attempt + 1} failed, retrying...`);
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async waitForPageLoad() {
    await expect(this.welcomeBackHeading).toBeVisible({ timeout: 10000 });
    await expect(this.googleSignInButton).toBeVisible({ timeout: 5000 });
  }

  async login(email: string, password: string) {
    console.log(`Logging in with email: ${email}`);
    await this.waitForPageLoad();
    
    await expect(this.emailInput.first()).toBeVisible({ timeout: 5000 });
    await this.emailInput.first().fill(email);
    
    await expect(this.passwordInput.first()).toBeVisible({ timeout: 5000 });
    await this.passwordInput.first().fill(password);
    
    await this.signInButton.click();
  }

  async clickGoogleSignIn() {
    console.log('Clicking Google Sign-In button');
    await expect(this.googleSignInButton).toBeVisible({ timeout: 5000 });
    await expect(this.googleSignInButton).toBeEnabled();
    await this.googleSignInButton.click();
  }

  async isGoogleSignInButtonVisible(): Promise<boolean> {
    try {
      await expect(this.googleSignInButton).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async isGoogleSignInButtonEnabled(): Promise<boolean> {
    try {
      await expect(this.googleSignInButton).toBeEnabled({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getGoogleSignInButtonText(): Promise<string> {
    await expect(this.googleSignInButton).toBeVisible();
    return await this.googleSignInButton.textContent() || '';
  }

  async hoverGoogleSignInButton() {
    await expect(this.googleSignInButton).toBeVisible();
    await this.googleSignInButton.hover();
  }

  async focusGoogleSignInButton() {
    await expect(this.googleSignInButton).toBeVisible();
    await this.googleSignInButton.focus();
  }

  async expectDashboard(timeout = 10000) {
    await expect(this.page.locator('text=Dashboard').first()).toBeVisible({ timeout });
  }

  async expectLoginPageVisible() {
    await expect(this.welcomeBackHeading).toBeVisible();
    await expect(this.emailInput.first()).toBeVisible();
    await expect(this.passwordInput.first()).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectErrorMessage(message: string) {
    const errorElement = this.page.getByText(message);
    await expect(errorElement).toBeVisible({ timeout: 5000 });
  }
}