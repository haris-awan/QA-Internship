// tests/search.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite: Search Functionality
// Covers: Task 2 – Navigate to Daraz.pk
//         Task 3 – Search for "electronics"
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const { HomePage }          = require('../pages/HomePage');
const { SearchResultsPage } = require('../pages/SearchResultsPage');

test.describe('Daraz Search – Tasks 2 & 3', () => {

  test('Task 2: should navigate to Daraz.pk successfully', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();

    // Verify we are on Daraz
    await expect(page).toHaveURL(/daraz\.pk/);
    console.log(`✅ Navigated to: ${page.url()}`);
  });

  test('Task 3: should search for "electronics" and show results', async ({ page }) => {
    const homePage          = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    // Navigate to homepage
    await homePage.navigate();

    // Search for electronics
    await homePage.searchFor('electronics');

    // Wait for results to load
    await searchResultsPage.waitForResults();

    // Verify URL contains search keyword or catalog
    const url = page.url();
    const hasSearchContext = url.includes('electronics') ||
                             url.includes('catalog') ||
                             url.includes('search');
    expect(hasSearchContext).toBeTruthy();
    console.log(`✅ Search results URL: ${url}`);
  });

  test('Task 3 + Task 6: should find electronics and count products > 0', async ({ page }) => {
    const homePage          = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    await homePage.navigate();
    await homePage.searchFor('electronics');
    await searchResultsPage.waitForResults();

    // Task 6: Count products and validate > 0
    const count = await searchResultsPage.countProducts();
    console.log(`✅ Products found on page: ${count}`);

    expect(count).toBeGreaterThan(0);
  });

});
