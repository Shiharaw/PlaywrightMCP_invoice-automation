// spec: specs/invoicedesk-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getCredentials, getBaseUrl } from '../../utils/test-data';

test.describe('Login Screen', () => {
  test('Valid Login (Happy Path) [BDD]', async ({ page }) => {
    const login = new LoginPage(page);
    const { email, password } = getCredentials();

    console.log('BASE_URL =', getBaseUrl());
    console.log('TEST_USER_EMAIL =', email);

    await test.step('Given I am on the login page', async () => {
      await login.goto();
      await expect(page.getByText(/welcome back/i).first()).toBeVisible({ timeout: 5000 });
    });

    await test.step('When I submit valid credentials', async () => {
      await login.login(email, password);
    });

    await test.step('Then I should see the dashboard', async () => {
      await login.expectDashboard(10000);
    });
  });
});