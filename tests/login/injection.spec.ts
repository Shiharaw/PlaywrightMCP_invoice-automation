import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getBaseUrl } from '../../utils/test-data';

const payloads = ["' OR '1'='1", "<script>alert(1)</script>"];

test.describe('Injection and malformed input handling', () => {
  for (const p of payloads) {
    test(`Rejects payload: ${p}`, async ({ page }) => {
      const login = new LoginPage(page);

      console.log('BASE_URL =', getBaseUrl());
      console.log('PAYLOAD =', p);

      await login.goto();
      // ensure inputs are visible before interacting to avoid flakiness
      await expect(login.emailInput.first()).toBeVisible({ timeout: 5000 });
      await expect(login.passwordInput.first()).toBeVisible({ timeout: 5000 });
      await login.emailInput.first().fill(p);
      await login.passwordInput.first().fill(p);
      await login.signInButton.click();

      // Should not show server error or stack trace
      await expect(page.getByText(/internal server error|stack trace|exception/i).first()).toHaveCount(0);

      // Should show a safe error message or remain on login
      const safeErr = page.getByText(/invalid|error|not allowed|invalid input|credentials/i);
      if (await safeErr.count()) await expect(safeErr.first()).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveURL(/login/i);
    });
  }
});