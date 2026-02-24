import { test, expect, Locator } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { GoogleSignInPage } from '../../pages/GoogleSignInPage';
import { getBaseUrl } from '../../utils/test-data';

test.describe('Google Sign-In Tests', () => {

  test('Google sign-in button is visible and accessible', async ({ page }) => {
    const login = new LoginPage(page);
    console.log('BASE_URL =', getBaseUrl());

    await login.goto();

    // Verify that the Google sign-in button is visible and accessible
    const googleButton = page.getByRole('button', { name: /google|continue with google|sign in with google/i }).first();
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
    
    // Verify button contains Google-related text
    await expect(googleButton).toContainText(/Google/i);
    
    // Check accessibility attributes
    await expect(googleButton).toHaveAttribute('type', 'button');
  });

  test('Google OAuth flow initiation redirects to Google', async ({ page }) => {
    const login = new LoginPage(page);
    console.log('BASE_URL =', getBaseUrl());

    await login.goto();

    // Find Google sign-in button using multiple strategies
    const roleBtn = page.getByRole('button', { name: /google|continue with google|sign in with google/i }).first();
    const textBtn = page.getByText(/sign in with google|continue with google|google/i).first();
    const genericBtn = page.locator('button, a, [role="button"]', { hasText: /google|continue with google|sign in with google/i }).first();

    async function isVisibleSafe(locator: Locator) {
      try {
        return (await locator.count()) > 0 && (await locator.first().isVisible());
      } catch {
        return false;
      }
    }

    let googleBtn: Locator | null = null;
    if (await isVisibleSafe(roleBtn)) {
      googleBtn = roleBtn;
    } else if (await isVisibleSafe(textBtn)) {
      googleBtn = textBtn;
    } else if (await isVisibleSafe(genericBtn)) {
      googleBtn = genericBtn;
    } else {
      throw new Error('Google sign-in control not found on login page.');
    }

    await expect(googleBtn).toBeVisible({ timeout: 5000 });

    // Handle either popup OAuth flow or same-tab navigation
    const popupPromise = page.waitForEvent('popup', { timeout: 8000 }).catch(() => null);
    await googleBtn.click();

    let openedUrl: string | null = null;
    const popup = await popupPromise;

    if (popup) {
      await popup.waitForLoadState('domcontentloaded');
      openedUrl = popup.url();
    } else {
      await page.waitForURL(/accounts\.google\.com|oauth|signin/i, { timeout: 15000 });
      openedUrl = page.url();
    }

    expect(openedUrl).toMatch(/accounts\.google\.com|oauth|signin/i);
  });

  test('OAuth flow includes proper security parameters', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    
    const googleButton = page.getByRole('button', { name: /google|continue with google/i }).first();
    
    // Wait for navigation to Google OAuth page
    const navigationPromise = page.waitForURL(/accounts\.google\.com/, { timeout: 15000 });
    
    await googleButton.click();
    await navigationPromise;
    
    const currentUrl = page.url();
    
    // Verify URL contains required OAuth parameters
    expect(currentUrl).toMatch(/client_id/);
    expect(currentUrl).toMatch(/redirect_uri/);
    expect(currentUrl).toMatch(/response_type=code/);
    expect(currentUrl).toMatch(/scope.*profile.*email/);
    
    // Verify secure HTTPS protocol
    expect(currentUrl).toMatch(/^https:/);
  });

  test('Google sign-in flow handles cancellation gracefully', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    
    const googleButton = page.getByRole('button', { name: /google|continue with google/i }).first();
    
    // Start OAuth flow
    const navigationPromise = page.waitForURL(/accounts\.google\.com/, { timeout: 15000 });
    await googleButton.click();
    await navigationPromise;
    
    // Simulate user cancellation by going back
    await page.goBack();
    
    // Should return to login page gracefully
    await expect(page).toHaveURL(/login/i);
    await expect(googleButton).toBeVisible();
  });

  test('Handle network failures gracefully', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    
    const googleButton = page.getByRole('button', { name: /google|continue with google/i }).first();
    
    // Simulate network failure for Google OAuth requests
    await page.route('**/accounts.google.com/**', route => route.abort('failed'));
    
    // Click should not crash the page
    await googleButton.click();
    
    // Page should still be functional
    await expect(page).not.toHaveTitle(/error/i);
    await expect(login.emailInput.first()).toBeVisible();
  });

  test('Multiple rapid clicks are handled safely', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    
    const googleButton = page.getByRole('button', { name: /google|continue with google/i }).first();
    
    // Rapid clicks should not cause issues
    await Promise.all([
      googleButton.click(),
      googleButton.click(),
      googleButton.click()
    ]);
    
    // Should handle gracefully without multiple redirects
    await page.waitForTimeout(2000);
    await expect(page).not.toHaveTitle(/error/i);
  });

  test('Cross-browser button functionality', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    
    const googleButton = page.getByRole('button', { name: /google|continue with google/i }).first();
    
    // Button should render consistently
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
    
    // Should be clickable
    await expect(googleButton).toHaveCSS('cursor', 'pointer');
  });
});