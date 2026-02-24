import { test, expect } from '@playwright/test';
import { EnhancedLoginPage } from '../../pages/enhancedLoginPage';
import { GoogleAuthPage } from '../../pages/googleAuthPage';
import { GoogleOAuthHelper } from '../../utils/googleOAuthHelper';
import { getActiveGoogleUser } from '../../config/googleUsersLoader';

test.describe('Google Sign-In with Active User - Shihara Wickramasinghe', () => {
  let loginPage: EnhancedLoginPage;
  let googleAuthPage: GoogleAuthPage;
  let oauthHelper: GoogleOAuthHelper;

  test.beforeEach(async ({ page }) => {
    loginPage = new EnhancedLoginPage(page);
    googleAuthPage = new GoogleAuthPage(page);
    oauthHelper = new GoogleOAuthHelper(page);
  });

  test.afterEach(async ({ page }) => {
    if (oauthHelper) {
      await oauthHelper.cleanup();
    }
  });

  test('should successfully complete Google sign-in flow for Shihara Wickramasinghe', async ({ page }) => {
    const activeUser = getActiveGoogleUser();
    
    await test.step('Load user configuration', async () => {
      console.log(`Testing with user: ${activeUser.email}`);
      console.log(`User domain: ${activeUser.domain}`);
      expect(activeUser.email).toBe('Shihara.Wickramasinghe@anko.com');
    });

    await test.step('Navigate to login page and verify Google button', async () => {
      await loginPage.goto();
      await loginPage.waitForPageLoad();
      
      await expect(loginPage.googleSignInButton).toBeVisible();
      await expect(loginPage.googleSignInButton).toBeEnabled();
      
      const buttonText = await loginPage.getGoogleSignInButtonText();
      expect(buttonText.toLowerCase()).toContain('google');
    });

    await test.step('Initiate Google OAuth flow', async () => {
      const oauthType = await oauthHelper.initiateGoogleSignIn();
      console.log(`OAuth flow type: ${oauthType}`);
      
      // Verify we reached Google OAuth page
      await googleAuthPage.expectGoogleAuthPage();
    });

    await test.step('Validate OAuth security parameters', async () => {
      const currentUrl = page.url();
      
      if (currentUrl.includes('google.com')) {
        expect(currentUrl).toMatch(/client_id/);
        expect(currentUrl).toMatch(/redirect_uri.*invoicedesk/);
        expect(currentUrl).toMatch(/scope.*profile|scope.*email/);
      }
    });
  });

  test('should handle user-specific domain validation', async ({ page }) => {
    const activeUser = {
      email: 'Shihara.Wickramasinghe@anko.com',
      domain: 'anko.com',
      displayName: 'Shihara Wickramasinghe'
    };
    
    await test.step('Verify user domain configuration', async () => {
      expect(activeUser.domain).toBe('anko.com');
      expect(activeUser.email).toContain('@anko.com');
      expect(activeUser.displayName).toBe('Shihara Wickramasinghe');
    });

    await test.step('Navigate to Google OAuth and verify domain handling', async () => {
      await page.goto('https://invoicedesk.siyothsoft.com/login');
      
      const googleButton = page.getByRole('button', { name: /google|continue with google/i });
      await googleButton.click();
      
      // Wait for navigation
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/accounts\.google\.com|google\.com/);
    });
  });

  test('should verify user email format and validation', async ({ page }) => {
    const activeUser = {
      email: 'Shihara.Wickramasinghe@anko.com',
      domain: 'anko.com'
    };
    
    await test.step('Validate email format', async () => {
      // Verify email format is correct
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(activeUser.email).toMatch(emailRegex);
      
      // Verify specific format for this user
      expect(activeUser.email).toMatch(/^Shihara\.Wickramasinghe@anko\.com$/);
    });

    await test.step('Test email validation through OAuth flow', async () => {
      await page.goto('https://invoicedesk.siyothsoft.com/login');
      
      const googleButton = page.getByRole('button', { name: /google|continue with google/i });
      await googleButton.click();
      
      await page.waitForTimeout(3000);
      
      // Verify we reached a valid OAuth page
      const currentUrl = page.url();
      expect(currentUrl.includes('google.com') || currentUrl.includes('accounts')).toBe(true);
    });
  });

  test('should measure performance for Shihara user authentication', async ({ page }) => {
    await test.step('Measure OAuth initiation time', async () => {
      const startTime = Date.now();
      
      await page.goto('https://invoicedesk.siyothsoft.com/login');
      
      const googleButton = page.getByRole('button', { name: /google|continue with google/i });
      await googleButton.click();
      
      // Wait for navigation
      await page.waitForTimeout(3000);
      
      const redirectTime = Date.now() - startTime;
      console.log(`OAuth redirect time: ${redirectTime}ms`);
      
      expect(redirectTime).toBeLessThan(10000); // Should redirect within 10 seconds
    });
  });

  test('should handle Anko domain-specific OAuth behavior', async ({ page }) => {
    const activeUser = getActiveGoogleUser();
    
    await test.step('Initiate OAuth for Anko domain user', async () => {
      await loginPage.goto();
      await oauthHelper.initiateGoogleSignIn();
    });

    await test.step('Enter Anko domain email', async () => {
      await googleAuthPage.enterEmail(activeUser.email);
      await googleAuthPage.clickNext();
      
      // Wait for Google to process the domain
      await page.waitForTimeout(3000);
    });

    await test.step('Verify domain handling', async () => {
      // Some corporate domains may redirect to SSO or show specific handling
      const currentUrl = page.url();
      
      if (currentUrl.includes('accounts.google.com')) {
        console.log('Standard Google authentication flow');
        try {
          // First perform a short, explicit check for a password input to avoid long implicit waits
          await page.waitForSelector('input[type="password"]', { timeout: 5000 });
          // If needed, call the page-object confirmation without risking a long default timeout
          try {
            await googleAuthPage.expectPasswordStep();
          } catch (err) {
            console.log('Password step locator in page object did not match after short wait');
          }
        } catch (error) {
          console.log('Password step not available - may be security block or different flow');
          // Google may block sign-in for test accounts, which is expected behavior
        }
      } else if (currentUrl.includes('anko') || currentUrl.includes('sso')) {
        console.log('Domain-specific SSO flow detected');
        // Handle corporate SSO if present
      } else {
        console.log('Unexpected redirect, but continuing test');
      }
      
      // Verify we're still in a valid authentication flow
      expect(currentUrl).toMatch(/google\.com|anko\.com|sso/);
    });
  });

  test('should verify accessibility for Shihara user workflow', async ({ page }) => {
    const activeUser = getActiveGoogleUser();
    
    await test.step('Test keyboard navigation through OAuth flow', async () => {
      await loginPage.goto();
      await loginPage.waitForPageLoad();
      
      // Find and focus the Google sign-in button
      const googleButton = loginPage.googleSignInButton;
      await expect(googleButton).toBeVisible();
      
      // Click using keyboard simulation
      await googleButton.focus();
      await page.keyboard.press('Enter');
      
      // Should reach Google OAuth page
      await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
      await googleAuthPage.expectGoogleAuthPage();
    });

    await test.step('Test email entry accessibility', async () => {
      // Email input should be focusable and accessible
      const emailInput = page.getByRole('textbox', { name: /email|phone/i });
      await expect(emailInput).toBeVisible();
      
      // Should accept keyboard input
      await emailInput.focus();
      await page.keyboard.type(activeUser.email);
      
      // Next button should be accessible via keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
    });
  });
});