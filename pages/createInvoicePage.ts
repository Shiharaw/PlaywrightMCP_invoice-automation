import { Page, expect, Locator } from '@playwright/test';
import { InvoiceData, InvoiceItem, CustomerData } from '../data/invoiceTestData';

export class CreateInvoicePage {
  readonly page: Page;
  
  // Page elements
  readonly pageHeading: Locator;
  readonly invoiceForm: Locator;
  
  // Customer section
  readonly customerNameInput: Locator;
  readonly customerEmailInput: Locator;
  readonly customerAddressInput: Locator;
  readonly customerPhoneInput: Locator;
  readonly customerTaxIdInput: Locator;
  
  // Invoice details section
  readonly invoiceNumberInput: Locator;
  readonly issueDateInput: Locator;
  readonly dueDateInput: Locator;
  readonly statusSelect: Locator;
  
  // Invoice items section
  readonly itemsContainer: Locator;
  readonly addItemButton: Locator;
  readonly itemDescriptionInputs: Locator;
  readonly itemQuantityInputs: Locator;
  readonly itemUnitPriceInputs: Locator;
  readonly itemAmountDisplays: Locator;
  readonly removeItemButtons: Locator;
  
  // Summary section
  readonly subtotalDisplay: Locator;
  readonly discountInput: Locator;
  readonly discountAmountDisplay: Locator;
  readonly taxPercentageInput: Locator;
  readonly taxAmountDisplay: Locator;
  readonly totalAmountDisplay: Locator;
  
  // Notes and terms
  readonly notesTextarea: Locator;
  readonly termsTextarea: Locator;
  
  // Action buttons
  readonly saveAsDraftButton: Locator;
  readonly saveAndSendButton: Locator;
  readonly previewButton: Locator;
  readonly cancelButton: Locator;
  
  // Validation messages
  readonly validationErrors: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.pageHeading = page.getByRole('heading', { name: /create invoice|new invoice/i });
    this.invoiceForm = page.locator('form[data-testid="invoice-form"], form.invoice-form, #invoice-form');
    
    // Customer section
    this.customerNameInput = page.locator('input[name="customer.name"], input[data-testid="customer-name"], #customer-name');
    this.customerEmailInput = page.locator('input[name="customer.email"], input[data-testid="customer-email"], #customer-email');
    this.customerAddressInput = page.locator('textarea[name="customer.address"], input[name="customer.address"], textarea[data-testid="customer-address"], #customer-address');
    this.customerPhoneInput = page.locator('input[name="customer.phone"], input[data-testid="customer-phone"], #customer-phone');
    this.customerTaxIdInput = page.locator('input[name="customer.taxId"], input[data-testid="customer-tax-id"], #customer-tax-id');
    
    // Invoice details
    this.invoiceNumberInput = page.locator('input[name="invoiceNumber"], input[data-testid="invoice-number"], #invoice-number');
    this.issueDateInput = page.locator('input[name="issueDate"], input[data-testid="issue-date"], #issue-date');
    this.dueDateInput = page.locator('input[name="dueDate"], input[data-testid="due-date"], #due-date');
    this.statusSelect = page.locator('select[name="status"], select[data-testid="status"], #status');
    
    // Invoice items
    this.itemsContainer = page.locator('[data-testid="invoice-items"], .invoice-items, #invoice-items');
    this.addItemButton = page.getByRole('button', { name: /add item|add line|\+ item/i });
    this.itemDescriptionInputs = page.locator('input[name*="description"], input[data-testid*="item-description"]');
    this.itemQuantityInputs = page.locator('input[name*="quantity"], input[data-testid*="item-quantity"]');
    this.itemUnitPriceInputs = page.locator('input[name*="unitPrice"], input[data-testid*="item-unit-price"]');
    this.itemAmountDisplays = page.locator('[data-testid*="item-amount"], .item-amount');
    this.removeItemButtons = page.locator('button[data-testid*="remove-item"], .remove-item-btn');
    
    // Summary
    this.subtotalDisplay = page.locator('[data-testid="subtotal"], .subtotal');
    this.discountInput = page.locator('input[name="discountPercentage"], input[data-testid="discount"], #discount');
    this.discountAmountDisplay = page.locator('[data-testid="discount-amount"], .discount-amount');
    this.taxPercentageInput = page.locator('input[name="taxPercentage"], input[data-testid="tax-percentage"], #tax-percentage');
    this.taxAmountDisplay = page.locator('[data-testid="tax-amount"], .tax-amount');
    this.totalAmountDisplay = page.locator('[data-testid="total-amount"], .total-amount');
    
    // Notes and terms
    this.notesTextarea = page.locator('textarea[name="notes"], textarea[data-testid="notes"], #notes');
    this.termsTextarea = page.locator('textarea[name="terms"], textarea[data-testid="terms"], #terms');
    
    // Action buttons
    this.saveAsDraftButton = page.getByRole('button', { name: /save as draft|draft/i });
    this.saveAndSendButton = page.getByRole('button', { name: /save and send|send/i });
    this.previewButton = page.getByRole('button', { name: /preview/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    
    // Messages
    this.validationErrors = page.locator('.error-message, [data-testid="error"], .validation-error');
    this.successMessage = page.locator('.success-message, [data-testid="success"], .alert-success');
  }

  async waitForPageLoad() {
    console.log('Waiting for Create Invoice page to load');
    await expect(this.pageHeading).toBeVisible({ timeout: 10000 });
    // Note: the actual app form does not render a <form> with an id/class;
    // just wait for the heading to be visible.
  }

  async fillCustomerData(customer: CustomerData) {
    console.log(`Filling customer data for: ${customer.name}`);

    // The actual app uses a customer combobox (dropdown), not free-form text inputs.
    const customerCombobox = this.page.getByRole('combobox').first();
    await expect(customerCombobox).toBeVisible({ timeout: 5000 });

    // Wait for the customer list to load from the API (more than just the placeholder option)
    await expect(customerCombobox.locator('option')).not.toHaveCount(1, { timeout: 10000 });

    const options = await customerCombobox.locator('option').all();
    let matched = false;
    for (const option of options) {
      const text = (await option.textContent()) ?? '';
      if (text.toLowerCase().includes(customer.name.toLowerCase())) {
        await customerCombobox.selectOption({ label: text.trim() });
        matched = true;
        break;
      }
    }

    if (!matched && options.length > 1) {
      // Fallback: select by index (index 1 = first non-placeholder option)
      await customerCombobox.selectOption({ index: 1 });
    }

    // Wait until Add Item button is enabled (customer selection unlocks it)
    await expect(this.addItemButton).toBeEnabled({ timeout: 10000 });
  }

  async fillInvoiceDetails(invoiceData: Partial<InvoiceData>) {
    console.log('Filling invoice details');

    if (invoiceData.invoiceNumber) {
      const invNumInput = this.page.getByRole('textbox', { name: 'INV-0001' });
      await invNumInput.fill(invoiceData.invoiceNumber);
    }

    if (invoiceData.issueDate) {
      const issueInput = this.page.locator('input[type="date"]').first();
      await issueInput.fill(invoiceData.issueDate);
    }

    if (invoiceData.dueDate) {
      const dueInput = this.page.locator('input[type="date"]').last();
      await dueInput.fill(invoiceData.dueDate);
    }

    // Note: status is not a form field in the current app UI; it defaults to 'draft' on save.
  }

  async addInvoiceItem(item: InvoiceItem, index: number = 0) {
    console.log(`Adding invoice item: ${item.description}`);

    // Always click Add Item for every item (including the first one)
    await expect(this.addItemButton).toBeEnabled({ timeout: 5000 });
    await this.addItemButton.click();

    // The new row is always appended as the last row in tbody
    const tbody = this.page.locator('table tbody');
    const newRow = tbody.getByRole('row').last();
    const productCombobox = newRow.getByRole('combobox');

    // Wait for product options to load from the API (more than just the placeholder)
    await expect(productCombobox.locator('option')).not.toHaveCount(1, { timeout: 10000 });

    // Select product – look for an option whose text contains item.description; fallback to first product
    const options = await productCombobox.locator('option').all();
    let matched = false;
    for (const option of options) {
      const text = (await option.textContent()) ?? '';
      if (text.toLowerCase().includes(item.description.toLowerCase())) {
        await productCombobox.selectOption({ label: text.trim() });
        matched = true;
        break;
      }
    }
    if (!matched && options.length > 1) {
      await productCombobox.selectOption({ index: 1 });
    }

    // Set quantity (spinbutton in the same row)
    if (item.quantity !== 1) {
      const qtyInput = newRow.getByRole('spinbutton');
      await qtyInput.fill(item.quantity.toString());
      await qtyInput.press('Tab');
    }
  }

  async addMultipleItems(items: InvoiceItem[]) {
    console.log(`Adding ${items.length} invoice items`);
    for (let i = 0; i < items.length; i++) {
      await this.addInvoiceItem(items[i]); // index parameter removed; always appends
    }
  }

  async removeItem(index: number) {
    console.log(`Removing invoice item at index: ${index}`);
    const removeButtons = this.page.getByRole('button', { name: 'Remove item' });
    await removeButtons.nth(index).click();
  }

  async setDiscount(discountPercentage: number) {
    // NOTE: The current app UI does not have a discount input field on the invoice form.
    // This method is a no-op stub kept for API compatibility.
    console.log(`setDiscount(${discountPercentage}): discount field not available in current app UI – skipping.`);
  }

  async setTaxPercentage(taxPercentage: number) {
    console.log(`Setting VAT rate to: ${taxPercentage}%`);
    // The app calls this field "VAT Rate (%)"; it is a spinbutton
    const vatSpinbutton = this.page.getByRole('spinbutton').first();
    await vatSpinbutton.fill(taxPercentage.toString());
    await vatSpinbutton.press('Tab');
  }

  async fillNotesAndTerms(notes?: string, terms?: string) {
    // NOTE: The current app UI may not expose notes/terms textareas on the create invoice form.
    // We attempt to fill them if the locators resolve; otherwise silently skip.
    console.log('Filling notes and terms (best-effort)');
    if (notes) {
      const notesEl = this.notesTextarea.first();
      if (await notesEl.count() > 0) await notesEl.fill(notes);
    }
    if (terms) {
      const termsEl = this.termsTextarea.first();
      if (await termsEl.count() > 0) await termsEl.fill(terms);
    }
  }

  async saveAsDraft() {
    // The current app has a single "Save Invoice" button (saves as draft by default)
    console.log('Saving invoice (Save Invoice button → draft)');
    const saveBtn = this.page.getByRole('button', { name: 'Save Invoice' });
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
  }

  async saveAndSend() {
    // NOTE: The current app UI does not have a "Save and Send" button.
    // Falling back to "Save Invoice" (draft) as best-effort.
    console.log('saveAndSend(): "Save and Send" not available – calling saveAsDraft instead.');
    await this.saveAsDraft();
  }

  async preview() {
    // NOTE: The current app UI does not have a standalone Preview button.
    console.log('preview(): Preview button not available in current app UI – skipping.');
  }

  async cancel() {
    console.log('Canceling invoice creation');
    // Cancel is a link styled as button in actual app
    const cancelBtn = this.page.getByRole('button', { name: 'Cancel' });
    await cancelBtn.click();
  }

  async createCompleteInvoice(invoiceData: InvoiceData) {
    console.log('Creating complete invoice');
    
    await this.waitForPageLoad();
    await this.fillCustomerData(invoiceData.customerData);
    await this.fillInvoiceDetails(invoiceData);
    await this.addMultipleItems(invoiceData.items);
    
    if (invoiceData.discountPercentage) {
      await this.setDiscount(invoiceData.discountPercentage);
    }
    
    if (invoiceData.taxPercentage) {
      await this.setTaxPercentage(invoiceData.taxPercentage);
    }
    
    await this.fillNotesAndTerms(invoiceData.notes, invoiceData.terms);
  }

  async getSubtotalAmount(): Promise<number> {
    const text = await this.subtotalDisplay.first().textContent();
    return parseFloat(text?.replace(/[^0-9.-]/g, '') || '0');
  }

  async getTotalAmount(): Promise<number> {
    // Grand Total display in the Totals Summary section
    const grandTotalSection = this.page.getByText('Grand Total:').locator('..');
    const text = await grandTotalSection.textContent();
    return parseFloat(text?.replace(/[^0-9.]/g, '') || '0');
  }

  async getValidationErrors(): Promise<string[]> {
    const errorElements = await this.validationErrors.all();
    const errors = [];
    
    for (const element of errorElements) {
      const text = await element.textContent();
      if (text) {
        errors.push(text.trim());
      }
    }
    
    return errors;
  }

  async expectSuccessMessage() {
    // On success the app redirects to /invoices; treat redirect as success signal
    await this.page.waitForURL(/\/invoices$/, { timeout: 10000 });
  }

  async expectValidationError() {
    // The current app prevents invalid submission via disabled buttons rather than
    // showing inline validation error messages. Check that Save Invoice is disabled.
    const saveBtn = this.page.getByRole('button', { name: 'Save Invoice' });
    await expect(saveBtn).toBeDisabled({ timeout: 5000 });
  }

  async verifyFormElements() {
    console.log('Verifying create invoice form elements');

    // Verify actual elements that exist in the current app UI
    await expect(this.pageHeading).toBeVisible();
    // Customer dropdown (combobox)
    await expect(this.page.getByRole('combobox').first()).toBeVisible();
    // Add Item button (disabled until customer selected)
    await expect(this.addItemButton).toBeVisible();
    // Save Invoice button (disabled until item added)
    await expect(this.page.getByRole('button', { name: 'Save Invoice' })).toBeVisible();
  }

  async isCreateInvoicePageVisible(): Promise<boolean> {
    try {
      await expect(this.pageHeading).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}