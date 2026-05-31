Cypress.Commands.add('loginViaUI', (username, password) => {
  cy.visit('/');
  cy.get('[data-test="username"]').clear().type(username);
  cy.get('[data-test="password"]').clear().type(password);
  cy.get('[data-test="login-button"]').click();
});

Cypress.Commands.add('loginViaSession', (username, password) => {
  cy.loginViaUI(username, password);
});

Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click();
  cy.get('[data-test="logout-sidebar-link"]').should('be.visible').click();
  cy.url().should('eq', Cypress.config('baseUrl') + '/');
});

Cypress.Commands.add('navigateToInventory', () => {
  cy.visit('/inventory.html');
  cy.get('[data-test="inventory-container"]').should('be.visible');
});

Cypress.Commands.add('clickProductByName', (name) => {
  cy.get('[data-test="inventory-item-name"]').contains(name).click();
  cy.url().should('include', 'inventory-item.html');
});

Cypress.Commands.add('addProductToCartByName', (name) => {
  cy.get('[data-test="inventory-item"]')
    .contains('[data-test="inventory-item-name"]', name)
    .parents('[data-test="inventory-item"]')
    .find('[data-test^="add-to-cart"]')
    .click();
});

Cypress.Commands.add('verifyErrorMessage', (message) => {
  cy.get('[data-test="error"]')
    .should('be.visible')
    .and('contain.text', message);
});

Cypress.Commands.add('verifyInventoryPageLoaded', () => {
  cy.url().should('include', '/inventory.html');
  cy.get('[data-test="title"]').should('be.visible').and('contain.text', 'Products');
  cy.get('[data-test="inventory-container"]').should('be.visible');
});

Cypress.Commands.add('sortProductsBy', (option) => {
  cy.get('[data-test="product-sort-container"]').select(option);
});
