import InventoryPage from '../pages/InventoryPage';

describe('Homepage - Inventory Page Validation (Task 3)', () => {

  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false, timeout: 120000 });
    cy.get('[data-test="username"]', { timeout: 30000 }).type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url({ timeout: 30000 }).should('include', '/inventory.html');
  });

  it('should display the page title as Products', () => {
    InventoryPage.pageTitle.should('be.visible').and('contain.text', 'Products');
  });

  it('should display the inventory container', () => {
    InventoryPage.inventoryContainer.should('be.visible');
  });

  it('should display exactly 6 products on the page', () => {
    InventoryPage.verifyProductCount(6);
  });

  it('should display all product names as non-empty visible text', () => {
    InventoryPage.verifyProductNamesVisible();
  });

  it('should include the Sauce Labs Backpack in the product list', () => {
    InventoryPage.productNames.contains('Sauce Labs Backpack').should('be.visible');
  });

  it('should display all product prices in dollar format', () => {
    InventoryPage.verifyProductPricesVisible();
  });

  it('should display product images with valid src attributes', () => {
    InventoryPage.verifyProductImagesVisible();
  });

  it('should display the shopping cart icon in the header', () => {
    InventoryPage.shoppingCartLink.should('be.visible');
  });

  it('should display the burger menu button in the header', () => {
    InventoryPage.burgerMenuButton.should('be.visible');
  });

  it('should sort products from low price to high price', () => {
    InventoryPage.sortProductsBy('lohi');
    InventoryPage.productPrices.then(function(prices) {
      var vals = Array.from(prices).map(function(el) { return parseFloat(el.innerText.replace('$','')); });
      var sorted = vals.slice().sort(function(a,b){ return a-b; });
      expect(vals).to.deep.equal(sorted);
    });
  });

  it('should sort products from high price to low price', () => {
    InventoryPage.sortProductsBy('hilo');
    InventoryPage.productPrices.then(function(prices) {
      var vals = Array.from(prices).map(function(el) { return parseFloat(el.innerText.replace('$','')); });
      var sorted = vals.slice().sort(function(a,b){ return b-a; });
      expect(vals).to.deep.equal(sorted);
    });
  });

  it('should sort products from A to Z', () => {
    InventoryPage.sortProductsBy('az');
    InventoryPage.productNames.then(function(names) {
      var vals = Array.from(names).map(function(el) { return el.innerText; });
      var sorted = vals.slice().sort();
      expect(vals).to.deep.equal(sorted);
    });
  });

  it('should show cart badge with count 1 after adding one product', () => {
    InventoryPage.addProductToCart('Sauce Labs Backpack');
    InventoryPage.verifyCartBadge(1);
  });

  it('should increase cart badge count when multiple items are added', () => {
    InventoryPage.addProductToCart('Sauce Labs Backpack');
    InventoryPage.addProductToCart('Sauce Labs Bike Light');
    InventoryPage.verifyCartBadge(2);
  });
});
