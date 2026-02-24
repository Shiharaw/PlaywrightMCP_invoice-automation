import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getBaseUrl } from '../../utils/test-data';

test('UI Elements Present', async ({ page }) => {
  const login = new LoginPage(page);

  console.log('BASE_URL =', getBaseUrl());

  await login.goto();

  await expect(page.getByText(/welcome back/i).first()).toBeVisible({ timeout: 5000 });
  await expect(login.emailInput.first()).toBeVisible({ timeout: 3000 });
  await expect(login.passwordInput.first()).toBeVisible({ timeout: 3000 });
  await expect(login.signInButton).toBeVisible();
  await expect(login.signInButton).toBeEnabled();

  // Optional elements -- check presence if available
  const social = page.getByText(/google|continue with google|sign in with google/i);
  if (await social.count()) await expect(social.first()).toBeVisible();

  const forgot = page.getByRole('link', { name: /forgot/i });
  const signup = page.getByRole('link', { name: /sign up|signup|register/i });
  if (await forgot.count()) await expect(forgot.first()).toBeVisible();
  if (await signup.count()) await expect(signup.first()).toBeVisible();
});