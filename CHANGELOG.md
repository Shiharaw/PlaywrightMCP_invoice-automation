# Changelog

## Unreleased

- Tests: added login test suite files for InvoiceDesk (ui-elements, invalid-password, nonexistent-account, empty-fields, invalid-email-format, injection, accessibility) — `tests/login/*`
- Page Object: improved `LoginPage` with retry on `goto()` to mitigate transient network errors — `tests/pages/loginPage.ts`
- Config: centralized base URL helper `tests/config/config.ts` and credentials loader `tests/config/credentials.ts` (supports env vars or `credentials.local.json`)
- Playwright config: recommend loading `.env.test` and using `use.baseURL` (set in `playwright.config.ts`) to allow relative `page.goto()` calls
- Fixes: updated failing tests to wait for visibility and use DOM `checkValidity()` for client-side validation checks

Notes:
- Local credentials file `tests/config/credentials.local.json` was added for convenience; ensure it's listed in `.gitignore` to avoid committing secrets.
