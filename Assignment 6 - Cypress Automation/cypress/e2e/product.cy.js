// cypress/e2e/product.cy.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite: Product Navigation & Validation
// Covers: Task 4 – Product Navigation and Validation
// ─────────────────────────────────────────────────────────────────────────────

import InventoryPage from '../pages/InventoryPage';
import ProductPage   from '../pages/ProductPage';

describe('Product Navigation – Listing Validation (Task 4)', () => {
  let users;

  // Products used across multiple tests
  const PRODUCTS = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
  ];

  before(() => {
    cy.fixture('users').then((data) => { users = data; });
  });

  beforeEach(() => {
    cy.loginViaSession(users.validUser.username, users.validUser.password);
    cy.visit('/inventory.html');
  });

  // ── Listing Page ──────────────────────────────────────────────────────────

  it('should display all 6 known product names on the inventory page', () => {
    PRODUCTS.forEach((name) => {
      cy.get('[data-test="inventory-item-name"]')
        .contains(name)
        .should('be.visible');
    });
  });

  it('should display a price for every product on the listing page', () => {
    cy.get('[data-test="inventory-item"]').each(($item) => {
      cy.wrap($item)
        .find('[data-test="inventory-item-price"]')
        .should('be.visible')
        .invoke('text')
        .should('match', /^\$\d+\.\d{2}$/);
    });
  });

  it('should display an "Add to cart" button for every product', () => {
    cy.get('[data-test="inventory-item"]').each(($item) => {
      cy.wrap($item)
        .find('[data-test^="add-to-cart"]')
        .should('be.visible');
    });
  });

  // ── Navigation: Inventory → Product Detail → Back ─────────────────────────

  it('should navigate to the Sauce Labs Backpack detail page', () => {
    InventoryPage.clickProductByName('Sauce Labs Backpack');

    ProductPage.verifyPageLoaded();
    ProductPage.verifyProductName('Sauce Labs Backpack');
  });

  it('should display correct product details on the detail page', () => {
    InventoryPage.clickProductByName('Sauce Labs Backpack');

    ProductPage.verifyPageLoaded();
    ProductPage.verifyProductName('Sauce Labs Backpack');
    ProductPage.verifyProductPrice();
    ProductPage.verifyProductDescription();
    ProductPage.verifyProductImage();
    ProductPage.verifyAddToCartButtonVisible();
    ProductPage.verifyBackButtonVisible();
  });

  it('should navigate to each product detail page and verify it loads', () => {
    PRODUCTS.forEach((productName) => {
      // Start fresh from inventory for each product
      cy.visit('/inventory.html');

      InventoryPage.clickProductByName(productName);

      // Verify URL changed and page loaded
      cy.url().should('include', 'inventory-item.html');
      ProductPage.verifyPageLoaded();
      ProductPage.verifyProductName(productName);

      // Verify price format
      ProductPage.verifyProductPrice();
    });
  });

  it('should navigate back to inventory using the Back to Products button', () => {
    InventoryPage.clickProductByName('Sauce Labs Bike Light');

    ProductPage.verifyPageLoaded();

    // Navigate back
    ProductPage.goBackToProducts();

    // Should be back on the inventory page
    InventoryPage.verifyPageLoaded();
  });

  // ── Add to Cart from Detail Page ──────────────────────────────────────────

  it('should add a product to cart from the product detail page', () => {
    InventoryPage.clickProductByName('Sauce Labs Bolt T-Shirt');

    ProductPage.verifyAddToCartButtonVisible();
    ProductPage.addToCart();

    // Button should now say "Remove"
    ProductPage.verifyRemoveButtonVisible();

    // Cart badge should show 1
    cy.get('[data-test="shopping-cart-badge"]')
      .should('be.visible')
      .and('contain.text', '1');
  });

  it('should remove a product from cart on the product detail page', () => {
    InventoryPage.clickProductByName('Sauce Labs Fleece Jacket');

    // Add then remove
    ProductPage.addToCart();
    ProductPage.verifyRemoveButtonVisible();

    ProductPage.removeFromCart();
    ProductPage.verifyAddToCartButtonVisible();

    // Cart badge should be gone
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  // ── Using Custom Commands ─────────────────────────────────────────────────

  it('should navigate to product using the custom cy.clickProductByName() command', () => {
    cy.clickProductByName('Sauce Labs Onesie');

    cy.url().should('include', 'inventory-item.html');
    ProductPage.verifyProductName('Sauce Labs Onesie');
  });

  it('should add product to cart using the custom cy.addProductToCartByName() command', () => {
    cy.addProductToCartByName('Sauce Labs Backpack');

    InventoryPage.verifyCartBadge(1);
  });
});
