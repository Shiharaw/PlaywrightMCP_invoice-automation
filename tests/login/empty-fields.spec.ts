import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getBaseUrl } from '../../utils/test-data';

test('Empty fields submission shows client validation', async ({ page }) => {
  const login = new LoginPage(page);

  console.log('BASE_URL =', getBaseUrl());

  await login.goto();
  await login.signInButton.click();

  // Expect client-side validation: the email input should be invalid
  const emailIsValid = await login.emailInput.first().evaluate((el: HTMLInputElement) => el.checkValidity());
  if (emailIsValid) {
    // try to find a visible validation message as fallback
    const requiredMsg = page.getByText(/required|please enter|this field is required/i);
    await expect(requiredMsg.first()).toBeVisible({ timeout: 3000 });
  } else {
    expect(emailIsValid).toBeFalsy();
  }
});