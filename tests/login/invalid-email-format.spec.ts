import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getBaseUrl } from '../../utils/test-data';

test('Invalid email format shows validation and prevents submit', async ({ page }) => {
  const login = new LoginPage(page);

  console.log('BASE_URL =', getBaseUrl());

  await login.goto();
  await login.emailInput.first().fill('user@@domain');
  await login.passwordInput.first().fill('SomePassword123');
  await login.signInButton.click();

  // Prefer checking the input validity via the DOM API
  const emailIsValid = await login.emailInput.first().evaluate((el: HTMLInputElement) => el.checkValidity());
  if (emailIsValid) {
    const invalidMsg = page.getByText(/valid email|enter a valid email|email is invalid/i);
    await expect(invalidMsg.first()).toBeVisible({ timeout: 3000 });
  } else {
    expect(emailIsValid).toBeFalsy();
  }

  await expect(page).toHaveURL(/login/i);
});