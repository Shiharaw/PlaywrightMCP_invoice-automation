# InvoiceDesk — Login Screen Test Plan

## Application Overview

InvoiceDesk login screen test plan covering happy paths, validation, security, and accessibility. Assumes a fresh session for each test and availability of a test user account when needed.

## Test Scenarios

### 1. Login Screen

**Seed:** `tests/seed.spec.ts`

#### 1.1. UI Elements Present

**File:** `tests/login/ui-elements.spec.ts`

**Steps:**
  1. Navigate to https://invoicedesk.siyothsoft.com/login with a fresh session
    - expect: Page shows heading 'Welcome Back' or equivalent
    - expect: Email input is visible and labeled
    - expect: Password input is visible and labeled
    - expect: 'Sign In' button is visible and enabled
    - expect: Social login options (e.g., 'Continue with Google') are present
    - expect: 'Sign up' or 'Forgot password' links are present

#### 1.2. Valid Login (Happy Path)

**File:** `tests/login/valid-login.spec.ts`

**Steps:**
  1. Use a valid test account (e.g., test+user@domain.com / Password123!) — credentials provided via test config/secrets
    - expect: User is authenticated and redirected to Dashboard or home page
    - expect: User's name or account identifier is visible on landing page
    - expect: No validation or error message is shown
    - expect: A session cookie or token is set

#### 1.3. Invalid Password

**File:** `tests/login/invalid-password.spec.ts`

**Steps:**
  1. Enter a valid email and an incorrect password, then click 'Sign In'
    - expect: An inline error message appears indicating invalid credentials
    - expect: User remains on the login page
    - expect: No stack trace or internal error shown to user
    - expect: Login attempts count increments if visible in UI or logs (if testable)

#### 1.4. Non-existent Account

**File:** `tests/login/nonexistent-account.spec.ts`

**Steps:**
  1. Enter an email that is not registered and a password, click 'Sign In'
    - expect: A clear error message indicates no account found or invalid credentials
    - expect: No sensitive information is disclosed
    - expect: User stays on login page

#### 1.5. Empty Fields Submission

**File:** `tests/login/empty-fields.spec.ts`

**Steps:**
  1. Leave email and password empty and click 'Sign In'
    - expect: Client-side validation triggers (e.g., 'Email is required', 'Password is required')
    - expect: No request or a blocked request is sent to backend if client validation present
    - expect: Focus moves to first invalid field
    - expect: Error messages are accessible (announced by screen readers)

#### 1.6. Invalid Email Format

**File:** `tests/login/invalid-email-format.spec.ts`

**Steps:**
  1. Enter an invalid email format (e.g., 'user@@domain', 'plaintext') and a password, then submit
    - expect: Client-side validation displays 'Enter a valid email' message
    - expect: No authentication request is processed
    - expect: Focus and aria-invalid attributes set on the email field

#### 1.7. Injection / Malformed Input Handling

**File:** `tests/login/injection.spec.ts`

**Steps:**
  1. Submit common injection strings in email and password fields (e.g., "' OR '1'='1", `<script>alert(1)</script>`) and submit
    - expect: Application rejects/escapes input and returns a safe error message
    - expect: No server error, stack trace, or DB dump is exposed
    - expect: Response time remains reasonable and app remains available

#### 1.8. Accessibility & Keyboard Navigation

**File:** `tests/login/accessibility.spec.ts`

**Steps:**
  1. Tab through interactive elements, use Enter to activate buttons and ensure screen-reader labels exist
    - expect: Tab order is logical and sequential
    - expect: All interactive elements are reachable by keyboard
    - expect: Form fields have associated labels and aria attributes
    - expect: Error messages are announced to assistive tech when they appear
