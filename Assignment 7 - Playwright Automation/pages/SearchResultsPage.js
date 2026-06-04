// pages/SearchResultsPage.js
// ─────────────────────────────────────────────────────────────────────────────
// Page Object Model – Search Results Page
// Handles filters, product listing, and result validation
// ─────────────────────────────────────────────────────────────────────────────

class SearchResultsPage {
  constructor(page) {
    this.page = page;

    // Product grid selectors
    this.productItems     = page.locator('[data-tracking="product-card"], .product-card, [class*="gridItem"], [class*="productItem"]');
    this.productNames     = page.locator('[class*="product-title"], [class*="title--wFj"], .product-title');
    this.productPrices    = page.locator('[class*="price--NVB"], [class*="product-price"], .price');

    // Filter selectors
    this.brandFilterSection  = page.locator('[data-mod-id="Brand"], [class*="filter-brand"], text=Brand').first();
    this.priceFilterMin      = page.locator('input[placeholder="Min"], input[name="min"], [class*="price-filter"] input').first();
    this.priceFilterMax      = page.locator('input[placeholder="Max"], input[name="max"], [class*="price-filter"] input').last();
    this.priceFilterButton   = page.locator('button:has-text("Go"), button:has-text("Apply"), [class*="price-filter"] button').first();
    this.filterContainer     = page.locator('[class*="filter"], [class*="Filter"]').first();

    // Sort and results
    this.resultsCount     = page.locator('[class*="results-count"], [class*="total"], h1').first();
    this.sortDropdown     = page.locator('[class*="sort"], select[name="sort"]').first();
    this.firstProduct     = page.locator('[data-tracking="product-card"], .product-card, [class*="gridItem"]').first();
    this.nextPageButton   = page.locator('[class*="next"], [aria-label="next"]').first();
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /**
   * Wait for search results to load
   */
  async waitForResults() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    // Wait for at least one product to appear
    await this.page.waitForSelector(
      '[data-tracking="product-card"], .product-card, [class*="gridItem--"], [class*="productItem"]',
      { timeout: 30000 }
    );
  }

  /**
   * Apply a brand filter by clicking on the brand name
   * @param {string} brandName - partial brand name text
   */
  async applyBrandFilter(brandName) {
    try {
      // Look for the brand in filter sidebar
      const brandOption = this.page.locator(
        `[class*="filter"] label:has-text("${brandName}"), [class*="filter"] span:has-text("${brandName}")`
      ).first();

      const isVisible = await brandOption.isVisible({ timeout: 8000 });
      if (isVisible) {
        await brandOption.click();
        await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
        await this.waitForResults();
        return true;
      }

      // Fallback: click "Brand" section heading to expand it
      const brandHeading = this.page.locator('text=Brand').first();
      if (await brandHeading.isVisible({ timeout: 5000 })) {
        await brandHeading.click();
        await this.page.waitForTimeout(1000);
        const option = this.page.locator(`label:has-text("${brandName}")`).first();
        if (await option.isVisible({ timeout: 5000 })) {
          await option.click();
          await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
          return true;
        }
      }
    } catch (e) {
      console.log(`Brand filter "${brandName}" not found or not applicable: ${e.message}`);
    }
    return false;
  }

  /**
   * Apply price range filter
   * @param {number} min - minimum price
   * @param {number} max - maximum price
   */
  async applyPriceFilter(min, max) {
    try {
      // Try direct input fields
      const minInput = this.page.locator(
        'input[placeholder="Min"], input[placeholder="min"], [class*="price"] input[type="text"]'
      ).first();
      const maxInput = this.page.locator(
        'input[placeholder="Max"], input[placeholder="max"], [class*="price"] input[type="text"]'
      ).last();

      const minVisible = await minInput.isVisible({ timeout: 8000 });

      if (minVisible) {
        await minInput.clear();
        await minInput.fill(String(min));
        await maxInput.clear();
        await maxInput.fill(String(max));

        // Press Enter or click Go button
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
        await this.waitForResults();
        return true;
      }

      // Fallback: use URL manipulation with price params
      const currentUrl = this.page.url();
      const url = new URL(currentUrl);
      url.searchParams.set('price', `${min}-${max}`);
      await this.page.goto(url.toString(), { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.waitForResults();
      return true;

    } catch (e) {
      console.log(`Price filter error: ${e.message}`);
      return false;
    }
  }

  /**
   * Count all visible products on the current page
   * @returns {number} product count
   */
  async countProducts() {
    await this.waitForResults();
    const selectors = [
      '[data-tracking="product-card"]',
      '.product-card',
      '[class*="gridItem--"]',
      '[class*="productItem--"]',
      '[class*="search-item"]',
    ];

    for (const selector of selectors) {
      const count = await this.page.locator(selector).count();
      if (count > 0) {
        console.log(`Found ${count} products using selector: ${selector}`);
        return count;
      }
    }
    return 0;
  }

  /**
   * Click on the first product in the results
   */
  async openFirstProduct() {
    await this.waitForResults();

    const selectors = [
      '[data-tracking="product-card"]',
      '.product-card',
      '[class*="gridItem--"]',
      '[class*="productItem--"]',
    ];

    for (const selector of selectors) {
      const count = await this.page.locator(selector).count();
      if (count > 0) {
        // Open in same tab to avoid popup handling complexity
        const firstItem = this.page.locator(selector).first();
        const link = firstItem.locator('a').first();

        const href = await link.getAttribute('href');
        if (href) {
          const fullUrl = href.startsWith('http') ? href : `https://www.daraz.pk${href}`;
          await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
          return true;
        }

        await firstItem.click();
        await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
        return true;
      }
    }
    return false;
  }

  // ─── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Verify the search results page is loaded
   * @param {string} keyword - expected keyword in URL or page
   */
  async verifySearchResults(keyword) {
    const url = this.page.url();
    const urlHasKeyword = url.toLowerCase().includes(keyword.toLowerCase()) ||
                          url.includes('catalog') ||
                          url.includes('search');
    return urlHasKeyword;
  }

  /**
   * Verify product count is greater than zero
   */
  async verifyProductCountGreaterThanZero() {
    const count = await this.countProducts();
    console.log(`Total products found: ${count}`);
    return count > 0;
  }
}

module.exports = { SearchResultsPage };
