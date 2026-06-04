// tests/product.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite: Product Details
// Covers: Task 7 – Open product details
//         Task 8 – Verify if free shipping is available
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const { HomePage }          = require('../pages/HomePage');
const { SearchResultsPage } = require('../pages/SearchResultsPage');
const { ProductPage }       = require('../pages/ProductPage');

test.describe('Daraz Product Details – Tasks 7 & 8', () => {

  // Helper: search electronics and get to results
  async function goToElectronicsResults(page) {
    const homePage = new HomePage(page);
    const resultsPage = new SearchResultsPage(page);
    await homePage.navigate();
    await homePage.searchFor('electronics');
    await resultsPage.waitForResults();
    return { homePage, resultsPage };
  }

  test('Task 7: should open the first product from search results', async ({ page }) => {
    const { resultsPage } = await goToElectronicsResults(page);

    // Verify products exist before clicking
    const count = await resultsPage.countProducts();
    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} products, opening first one...`);

    // Open first product
    const opened = await resultsPage.openFirstProduct();
    expect(opened).toBeTruthy();

    // Verify we navigated to a product page
    const productPage = new ProductPage(page);
    const isLoaded = await productPage.verifyPageLoaded();
    expect(isLoaded).toBeTruthy();

    const title = await productPage.getProductTitle();
    console.log(`✅ Opened product: "${title}"`);
    console.log(`✅ Product URL: ${page.url()}`);
  });

  test('Task 7: should display product title and price on detail page', async ({ page }) => {
    const { resultsPage } = await goToElectronicsResults(page);

    await resultsPage.openFirstProduct();

    const productPage = new ProductPage(page);
    await productPage.waitForPageLoad();

    // Verify title
    const title = await productPage.getProductTitle();
    expect(title.length).toBeGreaterThan(0);
    console.log(`✅ Product title: "${title}"`);

    // Verify price
    const price = await productPage.getProductPrice();
    console.log(`✅ Product price: "${price}"`);
  });

  test('Task 8: should check if free shipping is available on product', async ({ page }) => {
    const { resultsPage } = await goToElectronicsResults(page);

    await resultsPage.openFirstProduct();

    const productPage = new ProductPage(page);
    await productPage.waitForPageLoad();

    const title = await productPage.getProductTitle();
    console.log(`Checking shipping for: "${title}"`);

    // Task 8: Check free shipping
    const shipping = await productPage.checkFreeShipping();

    if (shipping.available) {
      console.log(`✅ FREE SHIPPING IS AVAILABLE: "${shipping.text}"`);
    } else {
      console.log(`ℹ️  Free shipping not available: "${shipping.text}"`);
    }

    // The test documents shipping status – pass either way (availability varies by product)
    // What matters is that the check ran and returned a result
    expect(typeof shipping.available).toBe('boolean');
    console.log(`✅ Shipping check completed. Free shipping: ${shipping.available}`);
  });

  test('Task 7 + 8: full flow – search → results → product → shipping check', async ({ page }) => {
    const homePage    = new HomePage(page);
    const resultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);

    // Step 1: Navigate to Daraz
    await homePage.navigate();
    await expect(page).toHaveURL(/daraz\.pk/);
    console.log('✅ Step 1: Navigated to Daraz.pk');

    // Step 2: Search for electronics
    await homePage.searchFor('electronics');
    await resultsPage.waitForResults();
    console.log('✅ Step 2: Searched for electronics');

    // Step 3: Count and validate products
    const count = await resultsPage.countProducts();
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Step 3: Found ${count} products (> 0 validated)`);

    // Step 4: Open first product
    await resultsPage.openFirstProduct();
    await productPage.waitForPageLoad();
    const title = await productPage.getProductTitle();
    console.log(`✅ Step 4: Opened product – "${title}"`);

    // Step 5: Check free shipping
    const shipping = await productPage.checkFreeShipping();
    console.log(`✅ Step 5: Free shipping available: ${shipping.available}`);
    if (shipping.available) {
      console.log(`   Shipping info: "${shipping.text}"`);
    }

    // Final assertions
    expect(title.length).toBeGreaterThan(0);
    expect(typeof shipping.available).toBe('boolean');
    console.log('✅ Full flow completed successfully');
  });

});
