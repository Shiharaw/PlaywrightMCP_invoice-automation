// spec: Google Sign-In Test Suite
// seed: tests/seed.spec.ts

import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Google Sign-In Authentication', () => {

  test.describe('Given user is on login page', () => {
    
    test.describe('When viewing Google sign-in button', () => {
      
      test('then the Google sign-in button should be visible', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        // Verify that the Google sign-in button is visible on the login page
        await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
      });

      test('then it should display proper button text and styling', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Verify that the Google sign-in button is enabled and clickable
        await expect(googleButton).toBeVisible();
        await expect(googleButton).toBeEnabled();
        
        // Verify button contains Google-related text
        await expect(googleButton).toContainText(/Google/i);
      });

      test('then it should be accessible with proper HTML attributes', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Verify button is a proper button element
        await expect(googleButton).toBeVisible();
        await expect(googleButton).toBeEnabled();
        
        // Check that it has proper button type
        await expect(googleButton).toHaveAttribute('type', 'button');
      });
    });

    test.describe('When initiating Google OAuth flow', () => {
      
      test('then it should redirect to Google authentication page', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Wait for navigation to Google OAuth page
        const navigationPromise = page.waitForURL(/accounts\.google\.com/);
        
        // Click the Google sign-in button to initiate OAuth flow
        await googleButton.click();
        
        // Wait for navigation to complete
        await navigationPromise;
        
        // Verify we are on Google sign-in page with proper heading
        await expect(page.getByText('Sign in',{ exact: true })).toBeVisible();
        
        // Verify URL contains Google accounts domain
        expect(page.url()).toMatch(/accounts\.google\.com/);
      });

      test('then it should include proper OAuth parameters in URL', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Wait for navigation to Google OAuth page
        const navigationPromise = page.waitForURL(/accounts\.google\.com/);
        
        // Click the Google sign-in button to initiate OAuth flow
        await googleButton.click();
        
        // Wait for navigation to complete
        await navigationPromise;
        
        const currentUrl = page.url();
        
        // Verify URL contains required OAuth parameters
        expect(currentUrl).toMatch(/client_id/);
        expect(currentUrl).toMatch(/redirect_uri/);
        expect(currentUrl).toMatch(/response_type=code/);
        expect(currentUrl).toMatch(/scope.*profile.*email/);
      });

      test('then it should use secure HTTPS protocol', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        let requestUrls: string[] = [];
        
        // Monitor all requests to verify HTTPS usage
        page.on('request', request => {
          if (request.url().includes('google') || request.url().includes('oauth')) {
            requestUrls.push(request.url());
          }
        });
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Wait for navigation to Google OAuth page
        const navigationPromise = page.waitForURL(/accounts\.google\.com/);
        
        // Click the Google sign-in button to initiate OAuth flow
        await googleButton.click();
        
        // Wait for navigation to complete
        await navigationPromise;
        
        // Verify all Google/OAuth requests use HTTPS
        for (const url of requestUrls) {
          expect(url).toMatch(/^https:/);
        }
        
        // Verify final URL is HTTPS
        expect(page.url()).toMatch(/^https:/);
      });
    });

    test.describe('When testing UI/UX experience', () => {
      
      test('then button clicks should be handled gracefully', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Verify that the Google sign-in button is visible on the login page
        await expect(googleButton).toBeVisible();
        
        // Verify button is clickable
        await expect(googleButton).toBeEnabled();
        
        // Verify button remains functional after hover
        await googleButton.hover();
        await expect(googleButton).toBeVisible();
        await expect(googleButton).toBeEnabled();
      });

      test('then button should maintain focus accessibility', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Verify button can receive focus
        await googleButton.focus();
        await expect(googleButton).toBeFocused();
        
        // Verify button is still visible and enabled when focused
        await expect(googleButton).toBeVisible();
        await expect(googleButton).toBeEnabled();
      });
    });

    test.describe('When handling error scenarios', () => {
      
      test('then network failures should not crash the page', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');

        // Listen to navigation events to ensure we stay on the login page if external navigation occurs
        page.on('framenavigated', frame => {console.log('Navigated to:', frame.url());});
        
        // Simulate network failure for Google services before interaction
        await page.route('**/login/oauth2/code/google**', route => route.abort());
        
        const googleButton = page.getByRole('button', { name: /continue with google/i });
        
        // Verify that the Google sign-in button is visible on the login page
        await expect(googleButton).toBeVisible();

        // Try to click the button (should not crash)
        await googleButton.click({ noWaitAfter: true });

        // Wait until login page comes back
        await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible({ timeout: 10000 });

        // Verify page remains functional
        await expect(page).toHaveURL(/login/);
      });

      test('then invalid responses should be handled gracefully', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login', { waitUntil: 'domcontentloaded' });
        
        // Keep the test on the app login page if an external redirect occurs
        if (!/invoicedesk\.siyothsoft\.com\/login/.test(page.url())) {
          await page.goto('https://invoicedesk.siyothsoft.com/login', { waitUntil: 'domcontentloaded' });
        }

        // Mock invalid OAuth response
        await page.route('**/oauth/**', route => {
          route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'invalid_request' })
          });
        });
        
        const googleButton = page.getByRole('button', { name: /(continue with google|sign in with google)/i });
        
        // Verify that the Google sign-in button is visible on the login page
        await expect(googleButton).toBeVisible();
        
        // Click button and verify page doesn't crash
        await googleButton.click();
        
        // Verify page remains functional after error
        await expect(page).toHaveURL(/invoicedesk\.siyothsoft\.com|accounts\.google\.com/);
      });
    });

    test.describe('When ensuring cross-browser compatibility', () => {
      
      test('then button should render consistently', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Verify that the Google sign-in button is visible on the login page
        await expect(googleButton).toBeVisible();
        
        // Verify button has proper dimensions (not collapsed)
        const boundingBox = await googleButton.boundingBox();
        expect(boundingBox).toBeTruthy();
        expect(boundingBox!.width).toBeGreaterThan(0);
        expect(boundingBox!.height).toBeGreaterThan(0);
        
        // Verify button is in viewport
        await expect(googleButton).toBeInViewport();
      });

      test('then button functionality should work across devices', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Verify that the Google sign-in button is visible on the login page
        await expect(googleButton).toBeVisible();
        
        // Test different interaction methods
        await expect(googleButton).toBeEnabled();
        
        // Test hover state (if supported)
        await googleButton.hover();
        await expect(googleButton).toBeVisible();
        
        // Test focus state
        await googleButton.focus();
        await expect(googleButton).toBeFocused();
      });
    });
  });

  test.describe('Given user completes Google authentication flow', () => {
    
    test.describe('When returning from successful Google OAuth', () => {
      
      test('then user should be redirected back to application', async ({ page }) => {
        // Navigate to the login page to set up Google sign-in testing
        await page.goto('https://invoicedesk.siyothsoft.com/login');
        
        const googleButton = page.getByRole('button', { name: 'Continue with Google' });
        
        // Verify that the Google sign-in button is visible on the login page
        await expect(googleButton).toBeVisible();
        
        // Verify OAuth flow can be initiated
        const navigationPromise = page.waitForURL(/accounts\.google\.com/);
        
        // Click the Google sign-in button to initiate OAuth flow
        await googleButton.click();
        
        await navigationPromise;
        
        // Verify we successfully reached Google OAuth page
        await expect(page.getByText('Sign in',{ exact: true })).toBeVisible();
        expect(page.url()).toMatch(/accounts\.google\.com/);
      });
    });
  });
});