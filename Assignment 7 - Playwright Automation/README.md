# Playwright Daraz.pk Automation – Assignment 7

![Playwright](https://img.shields.io/badge/Playwright-1.44-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v23-green)

End-to-end functional test automation for [Daraz.pk](https://www.daraz.pk) built with Playwright, implementing Page Object Model (POM) for maintainable and structured test suites.

---

## Project Overview

This project automates functional testing for Daraz.pk covering navigation, search, filters, product listing validation, product detail pages, and shipping verification — all structured using the Page Object Model pattern.

---

## Tools & Technologies

| Tool | Purpose |
|------|---------|
| Playwright 1.44 | E2E Testing Framework |
| JavaScript (ES6) | Programming Language |
| Node.js v23 | Runtime Environment |
| Page Object Model | Architecture Pattern |
| Git & GitHub | Version Control & Submission |

---

## Project Structure

```
playwright-daraz/
├── tests/
│   ├── search.spec.js       # Tasks 2 & 3: Navigate + Search electronics
│   ├── filters.spec.js      # Tasks 4, 5 & 6: Brand filter, price filter, count
│   └── product.spec.js      # Tasks 7 & 8: Product details + shipping check
├── pages/
│   ├── HomePage.js          # Home page POM: navigation, search
│   ├── SearchResultsPage.js # Results page POM: filters, product listing
│   └── ProductPage.js       # Product detail POM: title, price, shipping
├── playwright.config.js     # Playwright configuration
├── package.json             # Dependencies and scripts
└── README.md                # Documentation
```

---

## Tasks Completed

| Task | Description | File |
|------|-------------|------|
| Task 1 | Setup Playwright project | `playwright.config.js`, `package.json` |
| Task 2 | Navigate to Daraz.pk | `tests/search.spec.js` |
| Task 3 | Search for "electronics" | `tests/search.spec.js` |
| Task 4 | Apply brand filter | `tests/filters.spec.js` |
| Task 5 | Apply price filter (500–5000) | `tests/filters.spec.js` |
| Task 6 | Count products, validate > 0 | `tests/filters.spec.js` |
| Task 7 | Open product details | `tests/product.spec.js` |
| Task 8 | Verify free shipping | `tests/product.spec.js` |

---

## Getting Started

### Prerequisites
- Node.js v18 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/haris-awan/QA-Internship.git
cd "QA-Internship/Assignment 7 - Playwright Automation"

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Running Tests

```bash
# Run all tests (headed - you can see the browser)
npm run test:headed

# Run individual suites
npm run test:search     # Tasks 2 & 3
npm run test:filters    # Tasks 4, 5 & 6
npm run test:product    # Tasks 7 & 8

# Run all tests headlessly
npm test

# View HTML report after running
npm run report
```

---

## Page Object Model

### HomePage.js
- `navigate()` — go to daraz.pk
- `searchFor(keyword)` — use the search bar
- `dismissPopups()` — handle cookie banners

### SearchResultsPage.js
- `waitForResults()` — wait for product grid to load
- `countProducts()` — count all visible product cards
- `applyBrandFilter(brand)` — click brand in filter sidebar
- `applyPriceFilter(min, max)` — enter price range
- `openFirstProduct()` — navigate to first product

### ProductPage.js
- `waitForPageLoad()` — wait for product detail page
- `getProductTitle()` — read product name
- `getProductPrice()` — read product price
- `checkFreeShipping()` — detect free shipping availability
- `verifyPageLoaded()` — assert product page is loaded

---

## Author

**Muhammad Haris Awan**
Assignment 7 – Playwright Automation
