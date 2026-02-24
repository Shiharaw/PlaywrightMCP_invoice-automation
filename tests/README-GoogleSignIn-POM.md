# Google Sign-In Test Automation - POM Implementation

This test suite provides comprehensive automation testing for Google Sign-In functionality using the Page Object Model (POM) pattern.

## 📁 Project Structure

```
tests/
├── config/
│   ├── googleUsers.json          # User credentials configuration
│   ├── googleUsers.ts             # User data access layer
│   ├── global-setup.ts            # Test suite setup
│   └── global-teardown.ts         # Test suite cleanup
├── pages/
│   ├── enhancedLoginPage.ts       # Enhanced login page POM
│   └── googleAuthPage.ts          # Google OAuth page POM
├── utils/
│   └── googleOAuthHelper.ts       # OAuth flow utilities
└── login/
    ├── google-signin-pom.spec.ts     # Comprehensive POM tests
    └── google-signin-shihara.spec.ts # Shihara user-specific tests
```

## 👤 Test User Configuration

The test suite uses **Shihara.Wickramasinghe@anko.com** as the primary test user. User credentials are stored in:

- **Configuration File**: `tests/config/googleUsers.json`
- **Access Layer**: `tests/config/googleUsers.ts`

### User Data Structure:
```json
{
  "activeUser": {
    "email": "Shihara.Wickramasinghe@anko.com",
    "password": "GoogleTestPassword123!",
    "displayName": "Shihara Wickramasinghe",
    "domain": "anko.com"
  }
}
```

## 🏗️ Page Object Model Architecture

### EnhancedLoginPage
- Login page interactions
- Google Sign-In button management
- Page navigation and validation

### GoogleAuthPage  
- Google OAuth page handling
- Email/password entry
- OAuth parameter validation

### GoogleOAuthHelper
- Complete OAuth flow management
- Error handling and retry logic
- Performance monitoring

## 🧪 Test Categories

### 1. Comprehensive POM Tests (`google-signin-pom.spec.ts`)
- Button functionality and accessibility
- OAuth flow initiation and completion
- Error handling and edge cases
- Security validation
- Cross-browser compatibility

### 2. Shihara User-Specific Tests (`google-signin-shihara.spec.ts`)
- User-specific authentication flow
- Anko domain handling
- Performance measurements
- Accessibility testing

## 🚀 Running the Tests

### Run All Google Sign-In Tests
```bash
npx playwright test tests/login/google-signin-pom.spec.ts
npx playwright test tests/login/google-signin-shihara.spec.ts
```

### Run Specific Test Categories
```bash
# Button functionality tests
npx playwright test tests/login/google-signin-pom.spec.ts --grep "Button Functionality"

# Shihara user tests only
npx playwright test tests/login/google-signin-shihara.spec.ts

# OAuth flow tests
npx playwright test tests/login/google-signin-pom.spec.ts --grep "OAuth Flow"
```

### Run with UI Mode for Debugging
```bash
npx playwright test tests/login/google-signin-pom.spec.ts --ui
```

### Run in Different Browsers
```bash
# Chrome only
npx playwright test tests/login/google-signin-pom.spec.ts --project=chromium

# Firefox only  
npx playwright test tests/login/google-signin-pom.spec.ts --project=firefox

# All browsers
npx playwright test tests/login/google-signin-pom.spec.ts --project=chromium --project=firefox --project=webkit
```

## 🔧 Configuration

### Environment Variables
```bash
# Set base URL (optional, defaults to production)
export BASE_URL="https://invoicedesk.siyothsoft.com"

# Enable CI mode for retries and parallel execution
export CI=true

# Set Node environment
export NODE_ENV=test
```

### Test Timeouts
- **Standard timeout**: 30 seconds
- **OAuth flows**: 60 seconds  
- **Shihara user tests**: 120 seconds (corporate domain may have additional redirects)

## 🔐 Security Considerations

### OAuth Parameters Validated:
- ✅ `client_id` - Application identifier
- ✅ `redirect_uri` - Secure callback URL
- ✅ `response_type=code` - Authorization code flow
- ✅ `scope` - Profile and email permissions
- ✅ `state` - CSRF protection parameter

### Security Tests:
- HTTPS enforcement for all OAuth requests
- State parameter validation for CSRF protection
- Client ID verification
- Redirect URI validation

## 📊 Test Reports

Tests generate multiple report formats:
- **HTML Report**: `playwright-report/index.html`
- **JUnit XML**: `test-results/junit-results.xml`
- **JSON Results**: `test-results/json-results.json`

### View Reports
```bash
npx playwright show-report
```

## 🐛 Debugging

### Debug Mode
```bash
npx playwright test tests/login/google-signin-shihara.spec.ts --debug
```

### Headed Mode (Show Browser)
```bash
npx playwright test tests/login/google-signin-pom.spec.ts --headed
```

### Video Recording
Videos are automatically recorded on test failure and saved to `test-results/`

### Screenshots
Screenshots are captured on failure and available in the HTML report.

## ⚡ Performance Monitoring

The test suite monitors:
- **OAuth Redirect Time**: < 5 seconds
- **Email Processing Time**: < 10 seconds  
- **Full Authentication Flow**: < 2 minutes

Performance metrics are logged during test execution.

## 🔄 Continuous Integration

### CI Configuration
Tests are optimized for CI environments with:
- Retry logic for flaky OAuth flows
- Extended timeouts for network requests
- Parallel execution disabled for OAuth tests
- Comprehensive error reporting

### CI Commands
```bash
# Run all Google Sign-In tests in CI
npm run test:google-signin

# Run with coverage
npm run test:google-signin:coverage
```

## 🛠️ Troubleshooting

### Common Issues

1. **OAuth Timeout**
   - Check network connectivity
   - Verify Google services availability
   - Increase timeout values if needed

2. **Invalid Credentials**
   - Verify `googleUsers.json` configuration
   - Check user account status
   - Ensure domain permissions

3. **Element Not Found**
   - Update page object selectors
   - Check for UI changes
   - Verify timing/wait conditions

4. **Cross-Browser Issues**
   - Test on specific browser
   - Check browser-specific OAuth behavior
   - Update browser versions

### Debug Commands
```bash
# Verbose logging
DEBUG=pw:* npx playwright test tests/login/google-signin-shihara.spec.ts

# Trace collection
npx playwright test tests/login/google-signin-pom.spec.ts --trace on

# Step-by-step execution
npx playwright test tests/login/google-signin-shihara.spec.ts --debug --headed
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)

---

**Note**: This test suite requires proper Google OAuth configuration and may need manual intervention for 2FA-enabled accounts during development testing.