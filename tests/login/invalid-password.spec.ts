import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getCredentials, getBaseUrl } from '../../utils/test-data';

test('Invalid Password shows error and stays on login', async ({ page }) => {
  const login = new LoginPage(page);
  const { email } = getCredentials();

  console.log('BASE_URL =', getBaseUrl());
  console.log('TEST_USER_EMAIL =', email);

  await login.goto();
  await login.emailInput.first().fill(email);
  await login.passwordInput.first().fill('wrong-password-123');
  await login.signInButton.click();

  // Expect an inline error about invalid credentials
  await expect(page.getByText(/invalid|incorrect|credentials|email or password/i).first()).toBeVisible({ timeout: 5000 });
  await expect(page).toHaveURL(/login/i);
});