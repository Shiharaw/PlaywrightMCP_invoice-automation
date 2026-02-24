import { Page, expect, Locator } from '@playwright/test';
import { getBaseUrl } from '../config/config';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;
  readonly createInvoiceButton: Locator;
  readonly invoicesMenuLink: Locator;
  readonly dashboardMenuLink: Locator;
  readonly userProfileMenu: Locator;
  readonly logoutButton: Locator;
  readonly welcomeMessage: Locator;
  readonly recentInvoicesList: Locator;
  readonly invoiceStatsCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeading = page.getByRole('heading', { name: /dashboard/i });
    this.createInvoiceButton = page.getByRole('button', { name: /create invoice/i });
    this.invoicesMenuLink = page.getByRole('link', { name: /invoices/i });
    this.dashboardMenuLink = page.getByRole('link', { name: /dashboard/i });
    this.userProfileMenu = page.locator('[data-testid="user-menu"], .user-menu, .profile-menu');
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    this.welcomeMessage = page.locator('text*="Welcome"');
    this.recentInvoicesList = page.locator('[data-testid="recent-invoices"], .recent-invoices');
    this.invoiceStatsCards = page.locator('[data-testid="invoice-stats"], .invoice-stats, .stats-card');
  }

  async goto() {
    const base = getBaseUrl();
    console.log(`Navigating to dashboard: ${base}/dashboard`);
    
    await this.page.goto(`${base}/dashboard`);
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    console.log('Waiting for dashboard to load');
    await expect(this.dashboardHeading).toBeVisible({ timeout: 10000 });
  }

  async clickCreateInvoice() {
    console.log('Navigating to invoices page and clicking Create Invoice button');
    // The Create Invoice button only lives on the /invoices list page
    await this.page.goto(`${getBaseUrl()}/invoices`);
    await expect(this.createInvoiceButton).toBeVisible({ timeout: 30000 });
    await this.createInvoiceButton.click();
  }

  async navigateToInvoices() {
    console.log('Navigating to invoices page');
    await expect(this.invoicesMenuLink).toBeVisible({ timeout: 5000 });
    await this.invoicesMenuLink.click();
  }

  async isDashboardVisible(): Promise<boolean> {
    try {
      await expect(this.dashboardHeading).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isCreateInvoiceButtonVisible(): Promise<boolean> {
    try {
      await expect(this.createInvoiceButton).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isCreateInvoiceButtonEnabled(): Promise<boolean> {
    try {
      await expect(this.createInvoiceButton).toBeEnabled({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getWelcomeMessageText(): Promise<string> {
    await expect(this.welcomeMessage).toBeVisible();
    return await this.welcomeMessage.textContent() || '';
  }

  async getRecentInvoicesCount(): Promise<number> {
    try {
      const invoiceItems = this.recentInvoicesList.locator('li, .invoice-item, tr');
      return await invoiceItems.count();
    } catch {
      return 0;
    }
  }

  async verifyDashboardElements() {
    console.log('Verifying dashboard elements are present');
    
    // Core elements that should always be visible
    await expect(this.dashboardHeading).toBeVisible();
    await expect(this.createInvoiceButton).toBeVisible();
    await expect(this.invoicesMenuLink).toBeVisible();
  }

  async logout() {
    console.log('Logging out from dashboard');
    
    // Try direct logout button first
    try {
      await this.logoutButton.click({ timeout: 3000 });
    } catch {
      // If direct logout not visible, try user profile menu
      try {
        await this.userProfileMenu.click();
        await this.logoutButton.click();
      } catch {
        console.log('Logout button not found, navigating to login page');
        await this.page.goto(`${getBaseUrl()}/login`);
      }
    }
  }

  async expectDashboardPage() {
    await this.verifyDashboardElements();
    expect(this.page.url()).toMatch(/dashboard/i);
  }
}