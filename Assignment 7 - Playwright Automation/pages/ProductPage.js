// pages/ProductPage.js
// ─────────────────────────────────────────────────────────────────────────────
// Page Object Model – Product Detail Page
// Handles product details and shipping verification
// ─────────────────────────────────────────────────────────────────────────────

class ProductPage {
  constructor(page) {
    this.page = page;

    // Product detail selectors
    this.productTitle       = page.locator('[class*="pdp-product-title"], h1, [class*="title--"]').first();
    this.productPrice       = page.locator('[class*="pdp-price"], [class*="price--"], .pdp-price').first();
    this.productImage       = page.locator('[class*="pdp-image"], .pdp-img, [class*="gallery"] img').first();
    this.addToCartButton    = page.locator('button:has-text("Add to Cart"), [class*="add-to-cart"]').first();
    this.buyNowButton       = page.locator('button:has-text("Buy Now"), [class*="buy-now"]').first();

    // Shipping selectors - multiple fallbacks for Daraz's dynamic UI
    this.freeShippingBadge  = page.locator(
      '[class*="free-shipping"], [class*="freeShipping"], ' +
      'text=Free Shipping, text=FREE SHIPPING, ' +
      '[class*="shipping"] :has-text("Free"), ' +
      '[class*="delivery"] :has-text("Free")'
    ).first();

    this.shippingSection    = page.locator(
      '[class*="shipping"], [class*="delivery"], [class*="Delivery"]'
    ).first();

    this.deliveryInfo       = page.locator(
      '[class*="delivery-option"], [class*="shipping-info"], ' +
      '[data-spm*="deliver"], [class*="ServiceItem"]'
    );
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /**
   * Wait for product detail page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await this.productTitle.waitFor({ state: 'visible', timeout: 30000 });
  }

  // ─── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Get the product title text
   * @returns {string}
   */
  async getProductTitle() {
    await this.productTitle.waitFor({ state: 'visible', timeout: 20000 });
    return await this.productTitle.innerText();
  }

  /**
   * Get the product price text
   * @returns {string}
   */
  async getProductPrice() {
    try {
      await this.productPrice.waitFor({ state: 'visible', timeout: 10000 });
      return await this.productPrice.innerText();
    } catch {
      return 'Price not available';
    }
  }

  /**
   * Check if free shipping is available on this product
   * Tries multiple approaches since Daraz's UI varies
   * @returns {{ available: boolean, text: string }}
   */
  async checkFreeShipping() {
    // Approach 1: Look for explicit "free shipping" badge/text
    try {
      const freeShippingVisible = await this.freeShippingBadge.isVisible({ timeout: 8000 });
      if (freeShippingVisible) {
        const text = await this.freeShippingBadge.innerText();
        return { available: true, text: text.trim() };
      }
    } catch {}

    // Approach 2: Search all text on the page for "free shipping"
    try {
      const pageContent = await this.page.content();
      const hasFreeShipping =
        pageContent.toLowerCase().includes('free shipping') ||
        pageContent.toLowerCase().includes('free delivery') ||
        pageContent.toLowerCase().includes('freeshipping');

      if (hasFreeShipping) {
        return { available: true, text: 'Free Shipping (detected in page content)' };
      }
    } catch {}

    // Approach 3: Check delivery section text
    try {
      const deliveryItems = await this.deliveryInfo.all();
      for (const item of deliveryItems) {
        const text = (await item.innerText()).toLowerCase();
        if (text.includes('free') || text.includes('₨0') || text.includes('rs. 0')) {
          return { available: true, text: await item.innerText() };
        }
      }
    } catch {}

    return { available: false, text: 'Free shipping not found' };
  }

  /**
   * Verify the product detail page has loaded with all key elements
   * @returns {boolean}
   */
  async verifyPageLoaded() {
    const url = this.page.url();
    const isProductPage =
      url.includes('daraz.pk') &&
      (url.includes('-i') || url.includes('product') || url.includes('.html'));

    const titleVisible = await this.productTitle.isVisible({ timeout: 15000 });
    return isProductPage && titleVisible;
  }
}

module.exports = { ProductPage };
