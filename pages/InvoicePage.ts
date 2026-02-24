import { Page, expect, Locator } from '@playwright/test';
import { getBaseUrl } from '../utils/test-data';

export class InvoicePage {
  readonly page: Page;

  // Page elements
  readonly heading: Locator;
  readonly customerDropdown: Locator;
  readonly invoiceNumberInput: Locator;
  readonly addItemButton: Locator;
  readonly itemsTableBody: Locator;
  readonly vatRateSpinbutton: Locator;
  readonly subtotalLocator: Locator;
  readonly vatLocator: Locator;
  readonly grandTotalLocator: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly totalsSection: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Create Invoice', level: 1 });
    this.customerDropdown = page.getByRole('combobox').first();
    this.invoiceNumberInput = page.getByPlaceholder("INV-0001");
    this.addItemButton = page.getByRole('button', { name: 'Add Item' });
    this.itemsTableBody = page.locator('table tbody');
    this.vatRateSpinbutton = page.getByRole('spinbutton').first();
    
    // Totals
    const totalsSection = page.getByRole('heading', { name: 'Totals Summary' }).locator('..');
    this.totalsSection = totalsSection;
    this.subtotalLocator = totalsSection.locator('span.total-value').nth(0);
    this.vatLocator = totalsSection.locator('//div[2]/span[@class="total-value"]');
    this.grandTotalLocator = totalsSection.locator('//span[@class="grand-total-value"]');

    // Actions
    this.saveButton = page.getByRole('button', { name: 'Save Invoice' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async goto() {
    const base = getBaseUrl();
    await this.page.goto(`${base}/invoices/create`);
  }

  async waitForPageLoad() {
    await expect(this.heading).toBeVisible({ timeout: 10000 });
  }

  async selectCustomer(customerOption: string) {
    await this.customerDropdown.selectOption({ label: customerOption });
    await expect(this.addItemButton).toBeEnabled({ timeout: 5000 });
  }

  async addItem(productOption: string, quantity: number = 1) {
    await this.addItemButton.click();

    // Get the new row (last row)
    const newRow = this.itemsTableBody.getByRole('row').last();
    await newRow.getByRole('combobox').selectOption({ label: productOption });

    if (quantity !== 1) {
      await newRow.getByRole('spinbutton').fill(quantity.toString());
      await newRow.getByRole('spinbutton').press('Tab');
    }
  }

  async removeItem(rowIndex: number) {
    const rows = this.itemsTableBody.getByRole('row');
    await rows.nth(rowIndex).getByRole('button', { name: 'Remove item' }).click();
  }

  async updateItemQuantity(rowIndex: number, quantity: number) {
    const rows = this.itemsTableBody.getByRole('row');
    const quantityInput = rows.nth(rowIndex).getByRole('spinbutton');
    await quantityInput.fill(quantity.toString());
    await quantityInput.press('Tab');
  }

  async setVatRate(rate: number) {
    await this.vatRateSpinbutton.fill(rate.toString());
    await this.vatRateSpinbutton.press('Tab');
  }

  async saveInvoice() {
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  // Expectations
  async expectSubtotal(expected: string) {
    await expect(this.subtotalLocator).toHaveText(expected, { timeout: 10000 });
  }

  async expectVat(expected: string) {
    if (expected !== 'Rs 0.00') {
      await expect(this.vatLocator).toHaveText(expected);
    } else {
      await expect(this.vatLocator).not.toBeVisible();
    }
  }

  async expectGrandTotal(expected: string) {
    await expect(this.grandTotalLocator).toHaveText(expected, { timeout: 15000 });
  }

  async expectSaveButtonEnabled() {
    await expect(this.saveButton).toBeEnabled();
  }

  async expectSaveButtonDisabled() {
    await expect(this.saveButton).toBeDisabled();
  }

  async expectAddItemButtonEnabled() {
    await expect(this.addItemButton).toBeEnabled();
  }

  async expectAddItemButtonDisabled() {
    await expect(this.addItemButton).toBeDisabled();
  }

  async expectItemCount(count: number) {
    await expect(this.itemsTableBody.getByRole('row')).toHaveCount(count);
  }
}