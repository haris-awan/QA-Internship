/**
 * Page Object Model – Inventory / Homepage
 * URL: https://www.saucedemo.com/inventory.html
 *
 * Encapsulates all selectors and actions for the product listing page.
 */
class InventoryPage {
  // ─── Selectors ────────────────────────────────────────────────────────────
  get pageTitle()          { return cy.get('[data-test="title"]'); }
  get inventoryContainer() { return cy.get('[data-test="inventory-container"]'); }
  get inventoryItems()     { return cy.get('[data-test="inventory-item"]'); }
  get productNames()       { return cy.get('[data-test="inventory-item-name"]'); }
  get productPrices()      { return cy.get('[data-test="inventory-item-price"]'); }
  get productImages()      { return cy.get('.inventory_item_img img'); }
  get addToCartButtons()   { return cy.get('[data-test^="add-to-cart"]'); }
  get shoppingCartBadge()  { return cy.get('[data-test="shopping-cart-badge"]'); }
  get shoppingCartLink()   { return cy.get('[data-test="shopping-cart-link"]'); }
  get sortDropdown()       { return cy.get('[data-test="product-sort-container"]'); }
  get burgerMenuButton()   { return cy.get('#react-burger-menu-btn'); }
  get logoutLink()         { return cy.get('[data-test="logout-sidebar-link"]'); }
  get sidebarMenu()        { return cy.get('.bm-menu-wrap'); }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Navigate directly to the inventory page.
   * Useful when already authenticated (session cookie set).
   */
  visit() {
    cy.visit('/inventory.html');
    return this;
  }

  /**
   * Click the product name link to navigate to the product detail page.
   * @param {string} productName – exact text of the product
   */
  clickProductByName(productName) {
    cy.get('[data-test="inventory-item-name"]')
      .contains(productName)
      .click();
    return this;
  }

  /**
   * Click "Add to cart" for a specific product by name.
   * @param {string} productName
   */
  addProductToCart(productName) {
    cy.get('[data-test="inventory-item"]')
      .contains('[data-test="inventory-item-name"]', productName)
      .parents('[data-test="inventory-item"]')
      .find('[data-test^="add-to-cart"]')
      .click();
    return this;
  }

  /**
   * Sort the product list using the dropdown.
   * @param {string} sortValue – e.g. 'az', 'za', 'lohi', 'hilo'
   */
  sortProductsBy(sortValue) {
    this.sortDropdown.select(sortValue);
    return this;
  }

  /**
   * Open the burger / hamburger sidebar menu.
   */
  openMenu() {
    this.burgerMenuButton.click();
    return this;
  }

  /**
   * Log out via the sidebar menu.
   */
  logout() {
    this.openMenu();
    this.logoutLink.click();
    return this;
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  /**
   * Assert that the inventory page has loaded successfully.
   */
  verifyPageLoaded() {
    cy.url().should('include', '/inventory.html');
    this.pageTitle.should('be.visible').and('contain.text', 'Products');
    this.inventoryContainer.should('be.visible');
    return this;
  }

  /**
   * Assert the exact number of products displayed.
   * @param {number} count
   */
  verifyProductCount(count) {
    this.inventoryItems.should('have.length', count);
    return this;
  }

  /**
   * Assert all product names are visible.
   */
  verifyProductNamesVisible() {
    this.productNames.each(($el) => {
      cy.wrap($el).should('be.visible').and('not.be.empty');
    });
    return this;
  }

  /**
   * Assert all product prices are visible and match the £/$ price format.
   */
  verifyProductPricesVisible() {
    this.productPrices.each(($el) => {
      cy.wrap($el)
        .should('be.visible')
        .invoke('text')
        .should('match', /^\$\d+\.\d{2}$/);
    });
    return this;
  }

  /**
   * Assert all product images are visible and have a non-empty src attribute.
   */
  verifyProductImagesVisible() {
    this.productImages.each(($img) => {
      cy.wrap($img)
        .should('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty');
    });
    return this;
  }

  /**
   * Assert the shopping cart badge shows a specific count.
   * @param {string|number} count
   */
  verifyCartBadge(count) {
    this.shoppingCartBadge
      .should('be.visible')
      .and('contain.text', String(count));
    return this;
  }
}

module.exports = new InventoryPage();
