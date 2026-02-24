// spec: specs/invoicedesk-createInvoice.md
// Data-driven test data for Create Invoice tests
// Based on products available in the Shihara.inc organisation:
//   • "Ice Cream - Rs 1200.00"  → unit price Rs 1200.00
//   • "Cake - Rs 875.74"        → unit price Rs 875.74
// VAT default: 18 %

export interface CreateInvoiceItem {
  product: string;
  quantity: number;
}

export interface CreateInvoiceTestData {
  scenario: string;
  customer: string;
  vatRate: number;
  items: CreateInvoiceItem[];
  expectedSubtotal: string;
  expectedVat: string;
  expectedGrandTotal: string;
}

// ---------------------------------------------------------------------------
// Products available in the test organisation
// ---------------------------------------------------------------------------
export const PRODUCTS = {
  ICE_CREAM: 'Ice Cream - Rs 1200.00', // unit price: 1200.00
  CAKE: 'Cake - Rs 875.74',            // unit price:  875.74
} as const;

// ---------------------------------------------------------------------------
// Customers available in the test organisation
// ---------------------------------------------------------------------------
export const CUSTOMERS = {
  SHIHARA: 'Shihara Wickramasinghe (LKR)',
} as const;

// ---------------------------------------------------------------------------
// Helper – calculate expected totals (for documentation purposes)
//   subtotal  = Σ(unitPrice × qty)
//   vatAmount = subtotal × (vatRate / 100)  – rounded to 2 dp
//   grandTotal= subtotal + vatAmount
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Valid invoice creation test data sets
// ---------------------------------------------------------------------------
export const VALID_INVOICE_DATASETS: CreateInvoiceTestData[] = [
  {
    // 6.2 – Single item, default VAT  (1 × 1200 = 1200; VAT 18% = 216; total = 1416)
    scenario: 'Single item with default 18% VAT',
    customer: CUSTOMERS.SHIHARA,
    vatRate: 18,
    items: [
      { product: PRODUCTS.ICE_CREAM, quantity: 1 },
    ],
    expectedSubtotal: 'Rs 1200.00',
    expectedVat:      'Rs 216.00',
    expectedGrandTotal: 'Rs 1416.00',
  },
  {
    // 6.2 – Multiple items, default VAT  (2×1200 + 1×875.74 = 3275.74; VAT = 589.63; total = 3865.37)
    scenario: 'Multiple items with default 18% VAT',
    customer: CUSTOMERS.SHIHARA,
    vatRate: 18,
    items: [
      { product: PRODUCTS.ICE_CREAM, quantity: 2 },
      { product: PRODUCTS.CAKE,      quantity: 1 },
    ],
    expectedSubtotal: 'Rs 3275.74',
    expectedVat:      'Rs 589.63',
    expectedGrandTotal: 'Rs 3865.37',
  },
  {
    // 6.2 / 9.2 – Single item, custom 10% VAT  (3×1200 = 3600; VAT 10% = 360; total = 3960)
    scenario: 'Single item with custom 10% VAT rate',
    customer: CUSTOMERS.SHIHARA,
    vatRate: 10,
    items: [
      { product: PRODUCTS.ICE_CREAM, quantity: 3 },
    ],
    expectedSubtotal:   'Rs 3600.00',
    expectedVat:        'Rs 360.00',
    expectedGrandTotal: 'Rs 3960.00',
  },
  {
    // 8.1 / Real-time calc – high quantity triggers decimal-precision check
    // 5×1200 + 2×875.74 = 6000 + 1751.48 = 7751.48; VAT 18% = 1395.27; total = 9146.75
    scenario: 'High-quantity multi-item default VAT',
    customer: CUSTOMERS.SHIHARA,
    vatRate: 18,
    items: [
      { product: PRODUCTS.ICE_CREAM, quantity: 5 },
      { product: PRODUCTS.CAKE,      quantity: 2 },
    ],
    expectedSubtotal:   'Rs 7751.48',
    expectedVat:        'Rs 1395.27',
    expectedGrandTotal: 'Rs 9146.75',
  },
  {
    // 9.2 – Zero VAT scenario (tax-exempt like situation)
    // 1×875.74; VAT 0% = 0.00; total = 875.74
    scenario: 'Single item with 0% VAT (tax-exempt)',
    customer: CUSTOMERS.SHIHARA,
    vatRate: 0,
    items: [
      { product: PRODUCTS.CAKE, quantity: 1 },
    ],
    expectedSubtotal:   'Rs 875.74',
    expectedVat:        'Rs 0.00',
    expectedGrandTotal: 'Rs 875.74',
  },
];

// ---------------------------------------------------------------------------
// XSS / security test payloads (Section 11.1)
// ---------------------------------------------------------------------------
export const XSS_PAYLOADS = [
  "<script>alert('xss')</script>",
  "'; DROP TABLE invoices; --",
  '<img src=x onerror=alert(1)>',
];

// ---------------------------------------------------------------------------
// Business logic edge-case data (Section 11.2)
// ---------------------------------------------------------------------------
export const EDGE_CASE_VAT_RATES = {
  MAX_VAT: 100,  // Should not exceed 100 in sensible scenarios
  ZERO_VAT: 0,   // Tax-exempt
  DECIMAL_VAT: 8.5,
};