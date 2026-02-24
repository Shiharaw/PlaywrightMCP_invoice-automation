export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount?: number; // Calculated from quantity * unitPrice
  taxRate?: number;
  taxAmount?: number;
}

export interface CustomerData {
  name: string;
  email: string;
  address: string;
  phone?: string;
  taxId?: string;
}

export interface InvoiceData {
  invoiceNumber?: string; // Auto-generated if not provided
  customerData: CustomerData;
  issueDate: string; // YYYY-MM-DD format
  dueDate: string; // YYYY-MM-DD format
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  discountPercentage?: number;
  taxPercentage?: number;
  status?: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
}

export interface InvoiceSummary {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
}

// Test data templates
export const SAMPLE_CUSTOMERS: CustomerData[] = [
  {
    name: "ABC Corporation",
    email: "billing@abccorp.com",
    address: "123 Business St, Suite 100, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    taxId: "TAX-ABC-001"
  },
  {
    name: "XYZ Enterprises",
    email: "accounts@xyzenterprises.com",
    address: "456 Commerce Ave, Los Angeles, CA 90210",
    phone: "+1 (555) 987-6543",
    taxId: "TAX-XYZ-002"
  },
  {
    name: "Individual Client",
    email: "john.doe@email.com",
    address: "789 Residential Rd, Chicago, IL 60601",
    phone: "+1 (555) 456-7890"
  }
];

export const SAMPLE_INVOICE_ITEMS: InvoiceItem[] = [
  {
    description: "Web Development Services",
    quantity: 40,
    unitPrice: 75.00,
    taxRate: 10
  },
  {
    description: "Design Consultation",
    quantity: 5,
    unitPrice: 150.00,
    taxRate: 10
  },
  {
    description: "Project Management",
    quantity: 20,
    unitPrice: 85.00,
    taxRate: 10
  },
  {
    description: "Software License (Annual)",
    quantity: 1,
    unitPrice: 500.00,
    taxRate: 8
  }
];

export function createSampleInvoice(overrides?: Partial<InvoiceData>): InvoiceData {
  const defaultInvoice: InvoiceData = {
    customerData: SAMPLE_CUSTOMERS[0],
    issueDate: new Date().toISOString().split('T')[0], // Today
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from today
    items: [SAMPLE_INVOICE_ITEMS[0], SAMPLE_INVOICE_ITEMS[1]],
    notes: "Thank you for your business!",
    terms: "Payment due within 30 days",
    discountPercentage: 0,
    taxPercentage: 10,
    status: 'Draft'
  };

  return { ...defaultInvoice, ...overrides };
}

export function createComplexInvoice(): InvoiceData {
  return createSampleInvoice({
    customerData: SAMPLE_CUSTOMERS[1],
    items: SAMPLE_INVOICE_ITEMS.slice(0, 3),
    discountPercentage: 5,
    taxPercentage: 8.5,
    notes: "Multi-item invoice with discount and custom tax rate",
    terms: "Net 15 payment terms"
  });
}

export function createMinimalInvoice(): InvoiceData {
  return createSampleInvoice({
    customerData: {
      name: "Quick Customer",
      email: "quick@example.com",
      address: "123 Quick St"
    },
    items: [{
      description: "Basic Service",
      quantity: 1,
      unitPrice: 100.00
    }],
    notes: "",
    terms: ""
  });
}

// ---------------------------------------------------------------------------
// Convenience aliases used by BDD spec
// ---------------------------------------------------------------------------

export const sampleCustomers = {
  corporate:     SAMPLE_CUSTOMERS[0], // ABC Corporation
  small_business: SAMPLE_CUSTOMERS[1], // XYZ Enterprises
  individual:    SAMPLE_CUSTOMERS[2], // Individual Client
};

export const sampleInvoiceData = {
  items: SAMPLE_INVOICE_ITEMS,
};

/**
 * Calculate the grand total for a list of items with optional discount and tax.
 * discountPercentage and taxPercentage are 0-100 values.
 */
export function calculateInvoiceTotal(
  items: InvoiceItem[],
  discountPercentage: number,
  taxPercentage: number
): number {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = discountPercentage * subtotal / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = taxPercentage * discountedSubtotal / 100;
  return parseFloat((discountedSubtotal + taxAmount).toFixed(2));
}

/** Alias for createSampleInvoice – used by BDD spec as createTestInvoice */
export function createTestInvoice(overrides?: Partial<InvoiceData>): InvoiceData {
  return createSampleInvoice(overrides);
}

// ---------------------------------------------------------------------------

export function calculateInvoiceSummary(invoice: InvoiceData): InvoiceSummary {
  const subtotal = invoice.items.reduce((sum, item) => {
    const amount = item.quantity * item.unitPrice;
    return sum + amount;
  }, 0);

  const discountAmount = (invoice.discountPercentage || 0) * subtotal / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = (invoice.taxPercentage || 0) * discountedSubtotal / 100;
  const totalAmount = discountedSubtotal + taxAmount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2))
  };
}