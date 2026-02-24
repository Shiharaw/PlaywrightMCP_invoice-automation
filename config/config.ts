// central config for tests

export function getBaseUrl(): string {
  const base = process.env.BASE_URL || 'https://invoicedesk.siyothsoft.com';
  return base.replace(/\/$/, '');
}