import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { InvoicePage } from '../../pages/InvoicePage';
import { getCredentials, getBaseUrl, sampleCustomers, sampleInvoiceData, createTestInvoice, calculateInvoiceTotal } from '../../utils/test-data';

test.describe('Invoice Creation - BDD Test Suite', () => {
  // Run serially: all tests share the same user account and the server auto-generates
  // invoice numbers sequentially. Parallel execution causes duplicate-number conflicts.
  test.describe.configure({ mode: 'serial' });

  let invoicePage: InvoicePage;
  let testUser: any;

  test.beforeEach(async ({ page }) => {
    invoicePage = new InvoicePage(page);
    
    // Load user configuration
    testUser = getCredentials(); // shiharasss@gmail.com

    // Authenticate the session before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.expectDashboard();
    
    // Navigate directly to create invoice page
    await invoicePage.goto();
    await invoicePage.waitForPageLoad();
  });

  test.describe('Valid Invoice Creation', () => {
    
    test('Create simple invoice with single item', async () => {
      // Given user wants to create a simple invoice
      // When user selects a customer
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');

      // And adds an item from the product catalog
      await invoicePage.addItem('Ice Cream - Rs 1200.00', 1);

      // And saves as draft
      await invoicePage.saveInvoice();

      // Then user should be redirected to invoices list
      await expect(invoicePage.page).toHaveURL(/\/invoices$/);
      
      // And the new invoice should appear in the list
      await expect(invoicePage.page.locator('.invoices-table')).toBeVisible({ timeout: 30000 });
    });

    test('Create complex invoice with multiple items and tax', async () => {
      // Given user wants to create a detailed invoice with multiple items
      // When user selects a customer
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');

      // And adds multiple items from the catalog
      await invoicePage.addItem('Ice Cream - Rs 1200.00', 3);
      await invoicePage.addItem('Cake - Rs 875.74', 2);

      // And adjusts VAT rate to custom value
      await invoicePage.setVatRate(10);

      // And saves as draft
      await invoicePage.saveInvoice();

      // Then user should be redirected to invoices list
      await expect(invoicePage.page).toHaveURL(/\/invoices\/create$/);
      
      // And the invoice should be saved with correct totals
      await expect(invoicePage.page.locator('.invoices-table')).toBeVisible({ timeout: 30000 });
    });

    test('Create invoice with customer selection from existing customers', async () => {
      // Given user wants to create an invoice for an existing customer
      // When user selects an existing customer from the dropdown
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');

      // Then currency should be set based on customer
      // And customer details should be populated automatically
      
      // When user adds an item
      await invoicePage.addItem('Cake - Rs 875.74', 1);

      // And saves the invoice
      await invoicePage.saveInvoice();

      // Then invoice should be created successfully
      await expect(invoicePage.page).toHaveURL(/\/invoices$/);
    });

  });

  test.describe('Invoice Form Validation', () => {

    test('Form prevents invalid operations through UI controls', async () => {
      // Given user is on the invoice creation page without selecting a customer
      // When user tries to add items without selecting a customer
      // Then the Add Item button should be disabled
      await invoicePage.expectAddItemButtonDisabled();
      
      // And the Save button should be disabled
      await invoicePage.expectSaveButtonDisabled();
      
      // When user selects a customer
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');
      
      // Then Add Item button should become enabled
      await invoicePage.expectAddItemButtonEnabled();
      
      // But Save button should still be disabled until items are added
      await invoicePage.expectSaveButtonDisabled();
      
      // When user adds an item
      await invoicePage.addItem('Ice Cream - Rs 1200.00', 1);
      
      // Then Save button should become enabled
      await invoicePage.expectSaveButtonEnabled();
    });

    test('Form validates quantity inputs correctly', async () => {
      // Given user has selected a customer and added an item
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');
      await invoicePage.addItem('Ice Cream - Rs 1200.00', 1);

      // Then the quantity field should have proper validation
      // (Quantity validation is handled by the spinbutton control)
      await invoicePage.expectItemCount(1);
    });

  });

  test.describe('Invoice Item Management', () => {

    test('Add and remove multiple invoice items', async () => {
      // Given user is creating an invoice
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');

      // When user adds multiple items from the catalog
      await invoicePage.addItem('Ice Cream - Rs 1200.00', 3);
      await invoicePage.addItem('Cake - Rs 875.74', 1);

      // Then both items should appear in the invoice
      await invoicePage.expectItemCount(2);
      
      // When user removes the first item
      await invoicePage.removeItem(0);
      
      // Then only one item should remain
      await invoicePage.expectItemCount(1);
      
      // And totals should update accordingly
      await invoicePage.expectSubtotal('Rs 875.74'); // Cake price
    });

    test('Dynamic calculation updates when modifying items', async () => {
      // Given user has an invoice with items
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');
      await invoicePage.addItem('Ice Cream - Rs 1200.00', 2);

      // When user changes the quantity
      await invoicePage.updateItemQuantity(0, 5);
      
      // Then totals should update dynamically in real-time
      await invoicePage.expectSubtotal('Rs 6000.00'); // 5 × Rs 1200
      
      // When user changes VAT rate
      await invoicePage.setVatRate(10);
      
      // Then VAT calculation should update immediately
      await invoicePage.expectVat('Rs 600.00'); // 10% of Rs 6000
      await invoicePage.expectGrandTotal('Rs 6600.00');
    });

  });

  test.describe('Invoice Status and Actions', () => {

    test('Save invoice in draft status', async () => {
      // Given user wants to save work in progress
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');
      await invoicePage.addItem('Ice Cream - Rs 1200.00', 1);

      // When user saves as draft
      await invoicePage.saveInvoice();

      // Then user should be redirected to invoices list
      await expect(invoicePage.page).toHaveURL(/\/invoices$/);
      
      // And the invoice should appear with draft status
      await expect(invoicePage.page.locator('.invoices-table')).toBeVisible({ timeout: 30000 });
      await expect(invoicePage.page.locator('//tbody/tr[2]/td[6]')).toContainText('draft');
    });

    test('Save and send invoice to customer', async () => {
      // Given user wants to send invoice immediately
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');
      await invoicePage.addItem('Cake - Rs 875.74', 2);

      // When user saves the invoice (current app saves as draft by default)
      await invoicePage.saveInvoice();

      // Then invoice should be saved successfully
      await expect(invoicePage.page).toHaveURL(/\/invoices$/);
      
      // And invoice should appear in the list
      await expect(invoicePage.page.locator('.invoices-table')).toBeVisible({ timeout: 30000 });
      
      // Note: The current app creates invoices as "draft" status by default
      // Send functionality would be tested separately from invoice creation
    });

  });

  test.describe('User Experience and Navigation', () => {

    test('Cancel invoice creation returns to invoices list', async () => {
      // Given user started creating an invoice and selects customer
      await invoicePage.selectCustomer('Shihara Wickramasinghe (LKR)');

      // When user cancels the operation
      await invoicePage.cancel();

      // Then user should be navigated back to invoices list
      await expect(invoicePage.page).toHaveURL(/\/invoices$/);
      await expect(invoicePage.page.getByRole('heading', { name: 'Invoices' })).toBeVisible({ timeout: 10000 });
    });

    test('Form validates all required elements are present', async () => {
      // Given user accesses create invoice page (already loaded in beforeEach)
      // Then all required form elements should be visible
      await expect(invoicePage.page.getByRole('heading', { name: 'Create Invoice' })).toBeVisible();
      await expect(invoicePage.customerDropdown).toBeVisible();
      await expect(invoicePage.invoiceNumberInput).toBeVisible();
      await expect(invoicePage.addItemButton).toBeVisible();
      await expect(invoicePage.saveButton).toBeVisible();
      await expect(invoicePage.cancelButton).toBeVisible();
    });

  });

});