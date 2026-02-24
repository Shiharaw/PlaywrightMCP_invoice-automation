import { readFileSync } from 'fs';
import { join } from 'path';

export interface InvoiceUser {
  email: string;
  password: string;
  displayName: string;
  company: string;
  role: string;
  permissions: string[];
}

export interface InvoiceUsersConfig {
  primaryUser: InvoiceUser;
  testUser: InvoiceUser;
  viewOnlyUser: InvoiceUser;
}

function loadInvoiceUsers(): InvoiceUsersConfig {
  try {
    const jsonPath = join(__dirname, 'invoiceUsers.json');
    const jsonContent = readFileSync(jsonPath, 'utf-8');
    return JSON.parse(jsonContent) as InvoiceUsersConfig;
  } catch (error) {
    console.error('Failed to load invoice users configuration:', error);
    throw new Error('Invoice users configuration not found. Please ensure invoiceUsers.json exists.');
  }
}

export function getInvoiceUsers(): InvoiceUsersConfig {
  return loadInvoiceUsers();
}

export function getPrimaryInvoiceUser(): InvoiceUser {
  return getInvoiceUsers().primaryUser;
}

export function getTestInvoiceUser(): InvoiceUser {
  return getInvoiceUsers().testUser;
}

export function getViewOnlyInvoiceUser(): InvoiceUser {
  return getInvoiceUsers().viewOnlyUser;
}