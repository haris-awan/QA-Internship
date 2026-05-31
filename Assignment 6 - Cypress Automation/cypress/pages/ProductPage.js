/**
 * Page Object Model – Product Detail Page
 * URL: https://www.saucedemo.com/inventory-item.html?id=X
 *
 * Encapsulates all selectors and actions for an individual product detail page.
 */
class ProductPage {
  // ─── Selectors ────────────────────────────────────────────────────────────
  get productName()        { return cy.get('[data-test="inventory-item-name"]'); }
  get productDescription() { return cy.get('[data-test="inventory-item-desc"]'); }
  get productPrice()       { return cy.get('[data-test="inventory-item-price"]'); }
  get productImage()       { return cy.get('.inventory_details_img'); }
  get addToCartButton()    { return cy.get('[data-test^="add-to-cart"]'); }
  get removeButton()       { return cy.get('[data-test^="remove"]'); }
  get backButton()         { return cy.get('[data-test="back-to-products"]'); }
  get shoppingCartLink()   { return cy.get('[data-test="shopping-cart-link"]'); }
  get shoppingCartBadge()  { return cy.get('[data-test="shopping-cart-badge"]'); }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Click "Add to cart" on the product detail page.
   */
  addToCart() {
    this.addToCartButton.click();
    return this;
  }

  /**
   * Click "Remove" on the product detail page.
   */
  removeFromCart() {
    this.removeButton.click();
    return this;
  }

  /**
   * Navigate back to the product listing using the Back button.
   */
  goBackToProducts() {
    this.backButton.click();
    return this;
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  /**
   * Assert that the product detail page has loaded with all key elements.
   */
  verifyPageLoaded() {
    cy.url().should('include', 'inventory-item.html');
    this.productName.should('be.visible');
    this.productDescription.should('be.visible');
    this.productPrice.should('be.visible');
    this.productImage.should('be.visible');
    return this;
  }

  /**
   * Assert the displayed product name matches the expected value.
   * @param {string} expectedName
   */
  verifyProductName(expectedName) {
    this.productName
      .should('be.visible')
      .and('contain.text', expectedName);
    return this;
  }

  /**
   * Assert the product price is displayed and matches the price format.
   */
  verifyProductPrice() {
    this.productPrice
      .should('be.visible')
      .invoke('text')
      .should('match', /^\$\d+\.\d{2}$/);
    return this;
  }

  /**
   * Assert the product description is not empty.
   */
  verifyProductDescription() {
    this.productDescription
      .should('be.visible')
      .invoke('text')
      .should('not.be.empty');
    return this;
  }

  /**
   * Assert the product image loads (has a valid src).
   */
  verifyProductImage() {
    this.productImage
      .should('be.visible')
      .and('have.attr', 'src')
      .and('not.be.empty');
    return this;
  }

  /**
   * Assert the "Add to cart" button is visible and enabled.
   */
  verifyAddToCartButtonVisible() {
    this.addToCartButton.should('be.visible').and('not.be.disabled');
    return this;
  }

  /**
   * Assert the "Back to Products" button is present.
   */
  verifyBackButtonVisible() {
    this.backButton.should('be.visible');
    return this;
  }

  /**
   * After adding to cart, assert the button changes to "Remove".
   */
  verifyRemoveButtonVisible() {
    this.removeButton.should('be.visible');
    return this;
  }
}

module.exports = new ProductPage();
