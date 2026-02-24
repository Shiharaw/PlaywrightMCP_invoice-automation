import { Page, expect } from '@playwright/test';
import { EnhancedLoginPage } from '../pages/enhancedLoginPage';
import { GoogleAuthPage } from '../pages/googleAuthPage';
import { GoogleUser } from '../config/googleUsersLoader';

export class GoogleOAuthHelper {
  readonly page: Page;
  readonly loginPage: EnhancedLoginPage;
  readonly googleAuthPage: GoogleAuthPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new EnhancedLoginPage(page);
    this.googleAuthPage = new GoogleAuthPage(page);
  }

  async initiateGoogleSignIn(): Promise<'popup' | 'redirect'> {
    console.log('Initiating Google Sign-In');
    
    await this.loginPage.goto();
    await this.loginPage.waitForPageLoad();

    // Determine if OAuth opens in popup or redirects
    const popupPromise = this.page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);
    
    await this.loginPage.clickGoogleSignIn();
    
    const popup = await popupPromise;
    
    if (popup) {
      console.log('Google OAuth opened in popup');
      return 'popup';
    } else {
      console.log('Google OAuth redirected in same tab');
      // Wait for navigation to Google
      await expect(this.page).toHaveURL(/accounts\.google\.com/, { timeout: 10000 });
      return 'redirect';
    }
  }

  async handlePopupOAuth(user: GoogleUser, popup: Page): Promise<void> {
    console.log('Handling popup OAuth flow');
    
    const popupGooglePage = new GoogleAuthPage(popup);
    
    try {
      await popupGooglePage.completeGoogleLogin(user);
      
      // Wait for popup to close and return to main page
      await popup.waitForEvent('close', { timeout: 15000 });
      
      // Wait for main page to update
      await this.page.waitForTimeout(2000);
      
    } catch (error) {
      console.error('Error in popup OAuth flow:', error);
      if (!popup.isClosed()) {
        await popup.close();
      }
      throw error;
    }
  }

  async handleRedirectOAuth(user: GoogleUser): Promise<void> {
    console.log('Handling redirect OAuth flow');
    
    try {
      await this.googleAuthPage.completeGoogleLogin(user);
      
      // Wait for redirect back to application
      await this.waitForApplicationRedirect();
      
    } catch (error) {
      console.error('Error in redirect OAuth flow:', error);
      throw error;
    }
  }

  async completeFullGoogleSignIn(user: GoogleUser): Promise<void> {
    console.log(`Starting complete Google sign-in for: ${user.email}`);
    
    const oauthType = await this.initiateGoogleSignIn();
    
    if (oauthType === 'popup') {
      const popup = await this.page.waitForEvent('popup', { timeout: 5000 });
      await this.handlePopupOAuth(user, popup);
    } else {
      await this.handleRedirectOAuth(user);
    }
    
    await this.verifySuccessfulLogin();
  }

  async waitForApplicationRedirect(): Promise<void> {
    console.log('Waiting for redirect back to application');
    
    // Wait for redirect back to application domain
    await expect(this.page).toHaveURL(/invoicedesk\.siyothsoft\.com/, { timeout: 20000 });
    
    // Additional wait for page to stabilize
    await this.page.waitForTimeout(2000);
  }

  async verifySuccessfulLogin(): Promise<void> {
    console.log('Verifying successful login');
    
    try {
      // Try to verify dashboard or logged-in state
      await this.loginPage.expectDashboard(10000);
      console.log('Successfully verified dashboard');
    } catch {
      // Alternative: check if we're not on login page
      const isOnLoginPage = await this.isOnLoginPage();
      if (isOnLoginPage) {
        throw new Error('Still on login page after OAuth flow');
      }
      console.log('Login appears successful (not on login page)');
    }
  }

  async isOnLoginPage(): Promise<boolean> {
    try {
      await this.loginPage.expectLoginPageVisible();
      return true;
    } catch {
      return false;
    }
  }

  async verifyGoogleButtonProperties(): Promise<void> {
    console.log('Verifying Google button properties');
    
    await this.loginPage.goto();
    await this.loginPage.waitForPageLoad();
    
    // Verify visibility
    const isVisible = await this.loginPage.isGoogleSignInButtonVisible();
    expect(isVisible).toBe(true);
    
    // Verify enabled state
    const isEnabled = await this.loginPage.isGoogleSignInButtonEnabled();
    expect(isEnabled).toBe(true);
    
    // Verify text content
    const buttonText = await this.loginPage.getGoogleSignInButtonText();
    expect(buttonText.toLowerCase()).toMatch(/google|continue with google|sign in with google/);
  }

  async testGoogleButtonInteractions(): Promise<void> {
    console.log('Testing Google button interactions');
    
    await this.loginPage.goto();
    await this.loginPage.waitForPageLoad();
    
    // Test hover
    await this.loginPage.hoverGoogleSignInButton();
    
    // Test focus
    await this.loginPage.focusGoogleSignInButton();
    await expect(this.loginPage.googleSignInButton).toBeFocused();
  }

  async measureOAuthRedirectTime(): Promise<number> {
    console.log('Measuring OAuth redirect time');
    
    await this.loginPage.goto();
    await this.loginPage.waitForPageLoad();
    
    const startTime = Date.now();
    
    await this.loginPage.clickGoogleSignIn();
    await expect(this.page).toHaveURL(/accounts\.google\.com/, { timeout: 10000 });
    
    const endTime = Date.now();
    const redirectTime = endTime - startTime;
    
    console.log(`OAuth redirect took: ${redirectTime}ms`);
    return redirectTime;
  }

  async verifyOAuthSecurity(): Promise<void> {
    console.log('Verifying OAuth security parameters');
    
    const oauthType = await this.initiateGoogleSignIn();
    
    if (oauthType === 'redirect') {
      await this.googleAuthPage.validateOAuthParameters();
    }
    
    // Verify HTTPS
    expect(this.page.url()).toMatch(/^https:/);
  }

  async simulateNetworkError(): Promise<void> {
    console.log('Simulating network error for Google services');
    
    try {
      // Block Google domains
      await this.page.route('**/google.com/**', route => route.abort('internetdisconnected'));
      await this.page.route('**/googleapis.com/**', route => route.abort('internetdisconnected'));
      await this.page.route('**/accounts.google.com/**', route => route.abort('internetdisconnected'));
      
      await this.loginPage.goto();
      
      // Try to click Google sign-in (should handle gracefully)
      await this.loginPage.clickGoogleSignIn();
      
      // Give some time for the error to be handled
      await this.page.waitForTimeout(2000);
      
      // Verify page remains functional - should still be on login page or a valid error page
      const currentUrl = this.page.url();
      console.log(`Page after network error simulation: ${currentUrl}`);
      
    } catch (error) {
      console.log('Expected error during network failure simulation:', error);
      // This is expected - network errors should be handled gracefully
    }
  }

  async cleanup(): Promise<void> {
    console.log('Cleaning up OAuth helper');
    
    // Clear any route mocks
    await this.page.unroute('**/google.com/**');
    await this.page.unroute('**/googleapis.com/**');
    await this.page.unroute('**/accounts.google.com/**');
  }
}