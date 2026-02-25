# 🚀 PlaywrightMCP Automation Framework

## 📌 Project Overview

A comprehensive Playwright automation testing framework built with **TypeScript** for testing InvoiceDesk application. This framework implements the **Page Object Model (POM)** design pattern and supports data-driven testing with reusable utilities for scalable and maintainable test automation.

**Target Application**: [InvoiceDesk](https://invoicedesk.siyothsoft.com)

---

## ✨ Key Features

- 🏗️ **Page Object Model (POM)** implementation
- 📊 **Data-driven testing** with structured test data
- 🌐 **Cross-browser testing** (Chromium, Firefox, WebKit)
- 🔧 **Configurable environments**
- 📈 **HTML test reporting**
- 🚀 **CI/CD ready** configuration
- 🧪 **Parallel test execution**
- 📧 **Email integration** with Nodemailer
- 📦 **Test archiving** capabilities

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Playwright** | Browser automation framework |
| **TypeScript** | Type-safe programming language |
| **Node.js** | Runtime environment |
| **Nodemailer** | Email functionality |
| **Archiver** | Test report archiving |

---

## 📂 Project Structure

```
PlaywrightMCP/
├── 📁 config/                    # Configuration management
│   ├── config.ts                 # Base configuration
│   ├── credentials.*.json        # Authentication credentials
│   ├── global-setup.ts           # Global test setup
│   └── *UsersLoader.ts          # User data loaders
├── 📁 data/                      # Test data management
│   ├── createInvoiceFormData.ts  # Invoice form data
│   └── invoiceTestData.ts        # Invoice test scenarios
├── 📁 pages/                     # Page Object Model classes
│   ├── createInvoicePage.ts      # Invoice creation page
│   ├── dashboardPage.ts          # Dashboard interactions
│   ├── loginPage.ts              # Login functionality
│   └── *.Page.ts                # Other page objects
├── 📁 tests/                     # Test suites
│   ├── google-signin/           # Google authentication tests
│   ├── invoice/                 # Invoice management tests
│   └── login/                   # Login functionality tests
├── 📁 utils/                     # Utility functions
├── 📁 scripts/                   # Helper scripts
├── playwright.config.ts          # Playwright configuration
└── package.json                 # Dependencies and scripts
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### 1️⃣ Clone the Repository
```bash
git clone <your-repository-url>
cd PlaywrightMCP
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Install Playwright Browsers
```bash
npx playwright install
```

### 4️⃣ Environment Configuration
1. Copy `config/credentials.example.json` to `config/credentials.local.json`
2. Update the credentials file with your test environment details
3. Set the `BASE_URL` environment variable if testing against a different environment:
   ```bash
   export BASE_URL=https://your-test-environment.com
   ```

---

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run specific test suite
npx playwright test tests/login/

# Run specific test file
npx playwright test tests/invoice/create-invoice.spec.ts

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Advanced Options

```bash
# Run tests with custom workers (parallel execution)
npx playwright test --workers=4

# Run tests with retries
npx playwright test --retries=2

# Run tests matching a pattern
npx playwright test --grep="login"

# Run tests and update snapshots
npx playwright test --update-snapshots
```

### Custom Scripts

```bash
# Run tests and archive report
npm run test:archive
```

---

## 📊 Test Reporting

### View HTML Report
```bash
npx playwright show-report
```

### Report Locations
- **HTML Report**: `playwright-report/index.html`
- **Test Results**: `test-results/`
- **Screenshots**: Captured on test failures
- **Videos**: Available for failed tests (when configured)

---

## 🧪 Test Categories

| Test Suite | Description | Location |
|------------|-------------|----------|
| **Login Tests** | Authentication flows | `tests/login/` |
| **Google Sign-In** | OAuth integration | `tests/google-signin/` |
| **Invoice Management** | CRUD operations | `tests/invoice/` |

---

## 🔧 Configuration

### Playwright Configuration
Key settings in `playwright.config.ts`:
- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Retry Logic**: 2 retries on CI
- **Browsers**: Chromium, Firefox, WebKit
- **Reports**: HTML format

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Target application URL | `https://invoicedesk.siyothsoft.com` |
| `CI` | CI/CD environment flag | `false` |

---

## 📝 Writing Tests

### Page Object Example
```typescript
// pages/loginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private usernameInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[data-testid="username"]');
        this.passwordInput = page.locator('[data-testid="password"]');
        this.loginButton = page.locator('[data-testid="login-btn"]');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
```

### Test Example
```typescript
// tests/login/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login Tests', () => {
    test('should login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await page.goto('/');
        await loginPage.login('testuser', 'password');
        
        await expect(page).toHaveURL('/dashboard');
    });
});
```

---

## 🔄 CI/CD Integration

This framework is ready for CI/CD integration with:
- **GitHub Actions** workflows
- **Docker** containerization support
- **Parallel execution** optimization
- **Artifact collection** for reports and screenshots

---

## 🐛 Troubleshooting

### Common Issues

**Browser Installation**
```bash
# Reinstall browsers
npx playwright install --force
```

**Permission Issues**
```bash
# On Linux/Mac
sudo npx playwright install-deps
```

**Test Debugging**
```bash
# Run specific test in debug mode
npx playwright test tests/login/login.spec.ts --debug
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-test-suite`
3. Follow the existing code structure and naming conventions
4. Add tests for new functionality
5. Ensure all tests pass: `npx playwright test`
6. Submit a pull request

---

## 📧 Contact & Support

**Author**: Shihara Wickramasinghe  
**Role**: QA Automation Engineer  
**Project**: PlaywrightMCP Automation Framework

---

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

---

*Last Updated: February 2026*