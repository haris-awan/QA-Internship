// cypress/e2e/login.cy.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite: Login
// Covers: Task 2 – Login Failure Scenarios
//         Task 3 – Login Success Flow
// ─────────────────────────────────────────────────────────────────────────────

import LoginPage    from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Login – Failure Scenarios (Task 2)', () => {
  // Load fixture data once for the whole suite
  let users;

  before(() => {
    cy.fixture('users').then((data) => { users = data; });
  });

  beforeEach(() => {
    LoginPage.visit();
  });

  it('should display error when both username and password are empty', () => {
    // Click login without entering any credentials
    LoginPage.clickLogin();

    LoginPage.verifyErrorMessage(users.errorMessages.missingUsername);
    LoginPage.verifyInputErrorStyling();
  });

  it('should display error when username is missing', () => {
    LoginPage.enterPassword(users.validUser.password);
    LoginPage.clickLogin();

    LoginPage.verifyErrorMessage(users.errorMessages.missingUsername);
  });

  it('should display error when password is missing', () => {
    LoginPage.enterUsername(users.validUser.username);
    LoginPage.clickLogin();

    LoginPage.verifyErrorMessage(users.errorMessages.missingPassword);
  });

  it('should display error for invalid credentials', () => {
    LoginPage.login(users.invalidUser.username, users.invalidUser.password);

    LoginPage.verifyErrorMessage(users.errorMessages.invalidCredentials);
    LoginPage.verifyInputErrorStyling();
  });

  it('should display error for a locked-out user', () => {
    LoginPage.login(users.lockedUser.username, users.lockedUser.password);

    LoginPage.verifyErrorMessage(users.errorMessages.lockedOut);
  });

  it('should dismiss the error message when the close button is clicked', () => {
    LoginPage.login(users.invalidUser.username, users.invalidUser.password);

    // Error should be visible before dismissal
    LoginPage.verifyErrorMessage(users.errorMessages.invalidCredentials);

    // Dismiss the error
    LoginPage.dismissError();

    // Error banner should no longer exist in the DOM
    LoginPage.verifyNoError();
  });

  it('should remain on the login page after a failed login attempt', () => {
    LoginPage.login(users.invalidUser.username, users.invalidUser.password);

    // URL must still be the root (login) page
    cy.url().should('not.include', '/inventory.html');
    LoginPage.logoHeader.should('be.visible');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Login – Success Flow (Task 3)', () => {
  let users;

  before(() => {
    cy.fixture('users').then((data) => { users = data; });
  });

  it('should log in successfully with valid credentials and reach the inventory page', () => {
    LoginPage.visit();
    LoginPage.verifyPageLoaded();

    LoginPage.login(users.validUser.username, users.validUser.password);

    // URL should change to /inventory.html
    cy.url().should('include', '/inventory.html');
  });

  it('should log in using the custom cy.loginViaUI() command', () => {
    cy.loginViaUI(users.validUser.username, users.validUser.password);

    cy.url().should('include', '/inventory.html');
  });

  it('should log in using cy.loginViaSession() and validate the session', () => {
    cy.loginViaSession(users.validUser.username, users.validUser.password);
    cy.visit('/inventory.html');

    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="inventory-container"]').should('be.visible');
  });

  it('should log out successfully after logging in', () => {
    cy.loginViaUI(users.validUser.username, users.validUser.password);

    // Use the custom logout command
    cy.logout();

    // Should be redirected back to the login page
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    LoginPage.loginButton.should('be.visible');
  });
});
