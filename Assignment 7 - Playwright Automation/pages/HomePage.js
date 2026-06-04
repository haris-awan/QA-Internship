// pages/HomePage.js
// ─────────────────────────────────────────────────────────────────────────────
// Page Object Model – Daraz Home Page
// Handles navigation and search functionality
// ─────────────────────────────────────────────────────────────────────────────

class HomePage {
  constructor(page) {
    this.page = page;

    // Selectors
    this.searchInput     = page.locator('#q, [name="q"], input[placeholder*="Search"]').first();
    this.searchButton    = page.locator('button[type="submit"], .search-box__button, [class*="search"] button').first();
    this.logo            = page.locator('.lzd-logo, img[alt*="Daraz"], img[alt*="daraz"]').first();
    this.cookieBanner    = page.locator('#onetrust-accept-btn-handler, button:has-text("Accept")').first();
    this.closePopup      = page.locator('[class*="close"], [aria-label="Close"], button:has-text("×")').first();
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /**
   * Navigate to Daraz homepage
   */
  async navigate() {
    await this.page.goto('https://www.daraz.pk', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    // Dismiss any popup or cookie banner if present
    await this.dismissPopups();
  }

  /**
   * Dismiss cookie banners or popups if they appear
   */
  async dismissPopups() {
    try {
      await this.cookieBanner.click({ timeout: 5000 });
    } catch {}
    try {
      await this.closePopup.click({ timeout: 3000 });
    } catch {}
  }

  /**
   * Search for a keyword using the search bar
   * @param {string} keyword
   */
  async searchFor(keyword) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.searchInput.clear();
    await this.searchInput.fill(keyword);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  // ─── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Verify homepage loaded successfully
   */
  async verifyPageLoaded() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    const url = this.page.url();
    expect(url).toContain('daraz.pk');
  }
}

module.exports = { HomePage };
