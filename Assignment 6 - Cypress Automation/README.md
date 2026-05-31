# Cypress SauceDemo Automation – Assignment 6

End-to-end UI test suite for [SauceDemo](https://www.saucedemo.com) built with Cypress, implementing the Page Object Model (POM) pattern, reusable custom commands, and structured test suites.

---

## Project Structure

```
cypress-saucedemo/
├── cypress/
│   ├── e2e/                    # Test specs
│   │   ├── login.cy.js         # Task 2 & 3 – Login failure + success
│   │   ├── homepage.cy.js      # Task 3    – Homepage/inventory validation
│   │   └── product.cy.js       # Task 4    – Product navigation & validation
│   ├── pages/                  # Page Object Model classes (Task 6)
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   └── ProductPage.js
│   ├── support/
│   │   ├── commands.js         # Custom commands (Task 5)
│   │   └── e2e.js              # Global config & hooks
│   └── fixtures/
│       └── users.json          # Test data (credentials & error messages)
├── cypress.config.js
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+ — [download](https://nodejs.org/)
- npm (bundled with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd cypress-saucedemo

# 2. Install dependencies
npm install
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm run cy:open` | Open Cypress Test Runner (interactive UI) |
| `npm run cy:run` | Run all tests headlessly |
| `npm run cy:run:login` | Run login spec only |
| `npm run cy:run:homepage` | Run homepage spec only |
| `npm run cy:run:product` | Run product spec only |

---

## Tasks Coverage

| Task | File(s) | Description |
|------|---------|-------------|
| 1 – Setup | `package.json`, `cypress.config.js` | Cypress project initialised with config and folder structure |
| 2 – Login Failure | `e2e/login.cy.js` | 7 negative login test cases with error message assertions |
| 3 – Login Success + Homepage | `e2e/login.cy.js`, `e2e/homepage.cy.js` | Successful login flow + 13 inventory page validations |
| 4 – Product Navigation | `e2e/product.cy.js` | Product listing, detail page navigation, cart interactions |
| 5 – Custom Commands | `support/commands.js` | 8 reusable commands: `loginViaUI`, `loginViaSession`, `logout`, `navigateToInventory`, `clickProductByName`, `addProductToCartByName`, `verifyErrorMessage`, `verifyInventoryPageLoaded`, `sortProductsBy` |
| 6 – POM | `pages/LoginPage.js`, `pages/InventoryPage.js`, `pages/ProductPage.js` | 3 Page Object classes separating selectors from test logic |

---

## Page Object Model

Each page class exposes:
- **Getters** – lazy `cy.get()` selectors (re-queried on each access, no stale elements)
- **Action methods** – encapsulate user interactions (e.g. `LoginPage.login(user, pass)`)
- **Assertion methods** – chainable assertions scoped to the page (e.g. `ProductPage.verifyPageLoaded()`)

---

## Custom Commands

| Command | Usage |
|---------|-------|
| `cy.loginViaUI(user, pass)` | Full UI login via form |
| `cy.loginViaSession(user, pass)` | Cached session login (faster) |
| `cy.logout()` | Sidebar logout |
| `cy.navigateToInventory()` | Go to `/inventory.html` |
| `cy.clickProductByName(name)` | Click product from listing |
| `cy.addProductToCartByName(name)` | Add product to cart by name |
| `cy.verifyErrorMessage(msg)` | Assert error banner text |
| `cy.verifyInventoryPageLoaded()` | Assert inventory page loaded |
| `cy.sortProductsBy(option)` | Use sort dropdown |

---

## Test Credentials (from SauceDemo)

| User | Username | Password |
|------|----------|----------|
| Standard | `standard_user` | `secret_sauce` |
| Locked out | `locked_out_user` | `secret_sauce` |
| Invalid | `invalid_user` | `wrong_password` |
