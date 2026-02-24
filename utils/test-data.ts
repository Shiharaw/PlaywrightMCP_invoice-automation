// Import from centralized config
export { getBaseUrl } from '../config/config';
export { getCredentials, TestUser } from '../config/credentials';

// Test data constants
export const CUSTOMERS = {
  SHIHARA: 'Shihara Wickramasinghe (LKR)',
  DEFAULT: 'Shihara Wickramasinghe (LKR)'
};

export const PRODUCTS = {
  ICE_CREAM: 'Ice Cream - Rs 1200.00',
  CAKE: 'Cake - Rs 875.74'
};

// Invoice test data
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CustomerData {
  name: string;
  email: string;
  currency: string;
}

export interface InvoiceData {
  customerData: CustomerData;
  items: InvoiceItem[];
  discountPercentage?: number;
  taxPercentage?: number;
  notes?: string;
  terms?: string;
}

export const sampleCustomers = {
  individual: {
    name: 'Shihara Wickramasinghe',
    email: 'shihara@example.com',
    currency: 'LKR'
  },
  corporate: {
    name: 'Tech Corp Ltd',
    email: 'billing@techcorp.com',
    currency: 'USD'
  },
  small_business: {
    name: 'Design Studio',
    email: 'hello@designstudio.com',
    currency: 'LKR'
  }
};

export const sampleInvoiceData = {
  items: [
    { description: 'Web Development Services', quantity: 40, unitPrice: 125.00 },
    { description: 'Logo Design', quantity: 1, unitPrice: 500.00 },
    { description: 'Content Writing', quantity: 5, unitPrice: 80.00 }
  ]
};

export function createTestInvoice(partial: Partial<InvoiceData>): InvoiceData {
  return {
    customerData: partial.customerData || sampleCustomers.individual,
    items: partial.items || sampleInvoiceData.items.slice(0, 1),
    discountPercentage: partial.discountPercentage || 0,
    taxPercentage: partial.taxPercentage || 18,
    notes: partial.notes || '',
    terms: partial.terms || ''
  };
}

export function calculateInvoiceTotal(
  items: InvoiceItem[],
  discountPercentage: number = 0,
  taxPercentage: number = 0
): number {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = subtotal * (discountPercentage / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercentage / 100);
  return taxableAmount + taxAmount;
}