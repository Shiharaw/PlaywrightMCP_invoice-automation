import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getBaseUrl } from '../../utils/test-data';

test('Non-existent account shows clear error', async ({ page }) => {
  const login = new LoginPage(page);
  const fakeEmail = `no-user-${Date.now()}@example.com`;

  console.log('BASE_URL =', getBaseUrl());
  console.log('TEST_USER_EMAIL =', fakeEmail);

  await login.goto();
  await login.emailInput.first().fill(fakeEmail);
  await login.passwordInput.first().fill('SomePassword!123');
  await login.signInButton.click();

  await expect(page.getByText(/no account|not found|invalid|credentials/i).first()).toBeVisible({ timeout: 5000 });
  await expect(page).toHaveURL(/login/i);
});