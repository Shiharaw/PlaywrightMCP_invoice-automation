// spec: specs/invoicedesk-createInvoice.md
// Page Object Model for the Create Invoice form
// Reflects the ACTUAL UI structure of invoicedesk.siyothsoft.com/invoices/create

import { Page, expect, Locator } from '@playwright/test';

export class InvoiceCreateFormPage {
  readonly page: Page;

  // ----- Page heading -----
  readonly heading: Locator;

  // ----- Customer & Invoice Details section -----
  readonly customerDropdown: Locator;
  readonly invoiceNumberInput: Locator;
  readonly issueDateInput: Locator;
  readonly dueDateInput: Locator;
  readonly currencyInput: Locator;   // disabled – driven by customer
  readonly vatRateSpinbutton: Locator;
  readonly vatRate: Locator;

  // ----- Invoice Items section -----
  readonly addItemButton: Locator;
  readonly itemsTableBody: Locator;

  // ----- Totals Summary section -----
  //readonly totalsSection: Locator;
  readonly totalsSection: Locator;
  readonly subtotalLocator: Locator;
  readonly vatLocator: Locator;
  readonly grandTotalLocator: Locator;

  // ----- Action buttons -----
  readonly saveInvoiceButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Create Invoice', level: 1 });

    // Customer & Invoice Details
    this.customerDropdown = page.getByRole('combobox').first();
    this.invoiceNumberInput = page.getByPlaceholder("INV-0001");
    // Issue / Due date inputs are unlabelled textboxes next to the visible label text
    this.issueDateInput = page.locator('div.form-group', { hasText: 'Issue Date' }).locator('input[type="date"]');
    this.dueDateInput = page.locator('div.form-group', { hasText: 'Due Date' }).locator('input[type="date"]');
    this.currencyInput = page.locator('input[disabled]');
    this.vatRateSpinbutton = page.getByRole('spinbutton').first(); // VAT Rate is first spinbutton on page
    this.vatRate = page.locator('//input[@type="number"]'); // VAT Rate value
    // Items
    this.addItemButton = page.getByRole('button', { name: 'Add Item' });
    this.itemsTableBody = page.locator('table tbody');

    // Totals – locate by the heading "Totals Summary" and traverse to its container
    this.totalsSection = page.getByRole('heading', { name: 'Totals Summary' }).locator('..');
    this.subtotalLocator = this.totalsSection.locator('span.total-value').nth(0); // Subtotal
    this.vatLocator = this.totalsSection.locator('//div[2]/span[@class="total-value"]');      // VAT
    this.grandTotalLocator = this.totalsSection.locator('//span[@class="grand-total-value"]'); // Grand Total

    // Actions
    this.saveInvoiceButton = page.getByRole('button', { name: 'Save Invoice' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  // ------------------------------------------------------------------ navigation
  async goto() {
    await this.page.goto('/invoices/create');
  }

  async waitForPageLoad() {
    await expect(this.heading).toBeVisible({ timeout: 10_000 });
  }

  // ------------------------------------------------------------------ customer
  async selectCustomer(customerOption: string) {
    await this.customerDropdown.selectOption({ label: customerOption });
    // Wait until "Add Item" becomes enabled (customer drives item availability)
    await expect(this.addItemButton).toBeEnabled({ timeout: 5_000 });
  }

  // ------------------------------------------------------------------ VAT
  async setVatRate(rate: number) {
    await this.vatRateSpinbutton.fill(rate.toString());
    // Blur to trigger recalculation
    await this.vatRateSpinbutton.press('Tab');
  }

  // ------------------------------------------------------------------ items
  /**
   * Add one line item. Expects the customer to already be selected.
   * @param productOption  The full option label, e.g. "Ice Cream - Rs 1200.00"
   * @param quantity       Desired quantity (default 1)
   * @param rowIndex       0-based index into existing data rows (auto-detected if omitted)
   */
  async addItem(productOption: string, quantity: number = 1) {
    await this.addItemButton.click();

    // The new row is always appended – use the last data row
    const newRow = this.itemsTableBody.getByRole('row').last();
    await newRow.getByRole('combobox').selectOption({ label: productOption });

    if (quantity !== 1) {
      await newRow.getByRole('spinbutton').fill(quantity.toString());
      // Blur to trigger recalculation
      await newRow.getByRole('spinbutton').press('Tab');
    }
  }

  /**
   * Add multiple items in sequence.
   */
  async addItems(items: Array<{ product: string; quantity?: number }>) {
    for (const item of items) {
      await this.addItem(item.product, item.quantity ?? 1);
    }
  }

  /**
   * Remove an item row by its 0-based index within the data rows.
   */
  async removeItem(rowIndex: number) {
    const rows = this.itemsTableBody.getByRole('row');
    await rows.nth(rowIndex).getByRole('button', { name: 'Remove item' }).click();
  }

  // ------------------------------------------------------------------ totals
  /** Returns raw text content of the Subtotal value, e.g. "Rs 1200.00" */
async getSubtotalText(): Promise<string> {
  return (await this.subtotalLocator.textContent())?.trim() ?? '';
}

  /** Returns raw text content of the VAT value, e.g. "Rs 216.00" */
async getVatText(): Promise<string> {
  return (await this.vatLocator.textContent())?.trim() ?? '';
}

  /** Returns raw text content of the Grand Total value, e.g. "Rs 1416.00" */
async getGrandTotalText(): Promise<string> {
  return (await this.grandTotalLocator.textContent())?.trim() ?? '';
}

  // ------------------------------------------------------------------ assertions
  async expectSubtotal(expected: string) {
    await expect(this.subtotalLocator).toHaveText(expected, { timeout: 10000 });
  }

  async expectVat(expected: string) {
    if (expected !== 'Rs 0.00') {
      await expect(this.vatLocator).toHaveText(expected);
    } else {
      await expect(this.vatLocator).not.toBeVisible();
    }
    

    //await expect(this.vatLocator).toHaveText(expected, { timeout: 10000 });
  }

    async expectVatWithZeroItems(expected: string) {
    await expect(this.vatLocator).toHaveText(expected, { timeout: 10000 });
  }

  async expectGrandTotal(expected: string) {
    await expect(this.grandTotalLocator).toHaveText(expected, { timeout: 15000 });
  }

  async expectSaveButtonEnabled() {
    await expect(this.saveInvoiceButton).toBeEnabled();
  }

  async expectSaveButtonDisabled() {
    await expect(this.saveInvoiceButton).toBeDisabled();
  }

  async expectAddItemButtonDisabled() {
    await expect(this.addItemButton).toBeDisabled();
  }

  async expectAddItemButtonEnabled() {
    await expect(this.addItemButton).toBeEnabled();
  }

  // ------------------------------------------------------------------ actions
  async saveInvoice() {
    await expect(this.saveInvoiceButton).toBeEnabled();
    await this.saveInvoiceButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}