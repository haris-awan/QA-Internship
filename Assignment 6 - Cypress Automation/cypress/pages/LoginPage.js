/**
 * Page Object Model – Login Page
 * URL: https://www.saucedemo.com
 *
 * Encapsulates all selectors and actions related to the login page.
 */
class LoginPage {
  // ─── Selectors ────────────────────────────────────────────────────────────
  get usernameInput()    { return cy.get('[data-test="username"]'); }
  get passwordInput()    { return cy.get('[data-test="password"]'); }
  get loginButton()      { return cy.get('[data-test="login-button"]'); }
  get errorMessage()     { return cy.get('[data-test="error"]'); }
  get errorCloseButton() { return cy.get('[data-test="error"] button'); }
  get logoHeader()       { return cy.get('.login_logo'); }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the SauceDemo login page.
   */
  visit() {
    cy.visit('/');
    return this;
  }

  /**
   * Type a value into the username field.
   * @param {string} username
   */
  enterUsername(username) {
    this.usernameInput.clear().type(username);
    return this;
  }

  /**
   * Type a value into the password field.
   * @param {string} password
   */
  enterPassword(password) {
    this.passwordInput.clear().type(password);
    return this;
  }

  /**
   * Click the login button.
   */
  clickLogin() {
    this.loginButton.click();
    return this;
  }

  /**
   * Full login action: fill both fields and submit.
   * @param {string} username
   * @param {string} password
   */
  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
    return this;
  }

  /**
   * Dismiss the error banner by clicking its close (×) button.
   */
  dismissError() {
    this.errorCloseButton.click();
    return this;
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  /**
   * Assert the login page is displayed (logo visible, URL is root).
   */
  verifyPageLoaded() {
    this.logoHeader.should('be.visible');
    cy.url().should('include', 'saucedemo.com');
    return this;
  }

  /**
   * Assert that the error banner is visible and contains the expected text.
   * @param {string} message
   */
  verifyErrorMessage(message) {
    this.errorMessage
      .should('be.visible')
      .and('contain.text', message);
    return this;
  }

  /**
   * Assert the error banner is NOT present (after dismiss or before any error).
   */
  verifyNoError() {
    this.errorMessage.should('not.exist');
    return this;
  }

  /**
   * Assert that the username / password inputs have the error styling class.
   */
  verifyInputErrorStyling() {
    this.usernameInput.should('have.class', 'input_error');
    this.passwordInput.should('have.class', 'input_error');
    return this;
  }
}

module.exports = new LoginPage();
