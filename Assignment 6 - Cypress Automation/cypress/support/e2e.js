// cypress/support/e2e.js
// ─────────────────────────────────────────────────────────────────────────────
// This file is loaded automatically before every spec file.
// Use it for global configuration, hooks, and importing support files.
// ─────────────────────────────────────────────────────────────────────────────

// Import custom commands (makes all cy.* custom commands available in tests)
import './commands';

// ─── Global Before/After Hooks ────────────────────────────────────────────────

// Silence common third-party / application errors that are not test failures
Cypress.on('uncaught:exception', (err) => {
  // Returning false prevents Cypress from failing the test on uncaught errors
  // originating from the application (e.g. ResizeObserver, analytics scripts)
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Script error')
  ) {
    return false;
  }
});
