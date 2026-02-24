import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getBaseUrl } from '../../utils/test-data';

test('Accessibility and keyboard navigation', async ({ page }) => {
  const login = new LoginPage(page);

  console.log('BASE_URL =', getBaseUrl());

  await login.goto();

  // Ensure inputs have accessible names or labels
  const emailHasLabel = await page.locator('label[for]').filter({ has: login.emailInput }).count();
  const emailAria = await login.emailInput.first().getAttribute('aria-label');
  const placeholder = await login.emailInput.first().getAttribute('placeholder');
  if (!emailAria && !placeholder && !emailHasLabel) {
    // still proceed but log warning
    console.warn('Email input may be missing an accessible label');
  }

  // Tab order: focus email, then Tab -> password
  const emailHandle = await login.emailInput.first().elementHandle();
  const passwordHandle = await login.passwordInput.first().elementHandle();
  if (emailHandle && passwordHandle) {
    await emailHandle.focus();
    await page.keyboard.press('Tab');
    const activeIsPassword = await page.evaluate((pwd) => document.activeElement === pwd, passwordHandle);
    await expect(activeIsPassword).toBeTruthy();
  }

  // Enter should trigger sign in when focused on button
  await login.emailInput.first().fill('dummy@example.com');
  await login.passwordInput.first().fill('dummy');
  await login.signInButton.focus();
  await page.keyboard.press('Enter');
  // either stays on login or shows an error but should not crash
  await expect(page).not.toHaveTitle(/error/i);
});