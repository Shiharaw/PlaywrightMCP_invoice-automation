import { Page, expect, Locator } from '@playwright/test';

export class GoogleSignInPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly signInButton: Locator;
  readonly signInHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[name="identifier"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.nextButton = page.getByRole('button', { name: /next|continue/i });
    this.signInButton = page.getByRole('button', { name: /sign in|next/i });
    this.signInHeading = page.getByRole('heading', { name: /sign in/i });
  }

  async waitForGoogleAuthPage() {
    console.log('Waiting for Google Auth page to load');
    await expect(this.signInHeading).toBeVisible({ timeout: 15000 });
    await expect(this.emailInput.first()).toBeVisible({ timeout: 5000 });
  }

  async isGoogleAuthPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('accounts.google.com') || url.includes('google.com/signin');
  }

  async enterEmail(email: string) {
    console.log(`Entering email: ${email}`);
    await this.waitForGoogleAuthPage();
    await this.emailInput.first().fill(email);
  }

  async clickNext() {
    console.log('Clicking Next button');
    await expect(this.nextButton.first()).toBeVisible({ timeout: 5000 });
    await this.nextButton.first().click();
  }

  async enterPassword(password: string) {
    console.log('Entering password');
    await expect(this.passwordInput.first()).toBeVisible({ timeout: 10000 });
    await this.passwordInput.first().fill(password);
  }

  async clickSignIn() {
    console.log('Clicking Sign In button');
    await expect(this.signInButton.first()).toBeVisible({ timeout: 5000 });
    await this.signInButton.first().click();
  }

  async completeGoogleLogin(email: string, password: string) {
    console.log(`Completing Google login for: ${email}`);
    
    try {
      await this.waitForGoogleAuthPage();
      await this.enterEmail(email);
      await this.clickNext();
      
      // Wait for password page
      await this.page.waitForTimeout(3000);
      
      await this.enterPassword(password);
      await this.clickSignIn();
    } catch (error) {
      console.log('Google login error:', error);
      throw error;
    }
  }

  async expectGoogleLoginSuccess() {
    // Wait for redirect back to the application
    await expect(this.page).toHaveURL(/invoicedesk|dashboard/i, { timeout: 15000 });
  }
}