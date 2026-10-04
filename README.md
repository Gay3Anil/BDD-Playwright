# Playwright BDD Framework

This starter framework tests SauceDemo using Playwright for browser automation and Cucumber as the BDD test runner. It does not execute scenarios with Playwright Test.

## Project Architecture

```text
features/              Gherkin feature files and tagged scenarios
step-definitions/      Cucumber Given/When/Then implementations
pages/                 Page Object Model selectors and UI actions
hooks/                 Per-scenario browser setup, teardown, and failure capture
support/               Typed Cucumber World shared by hooks and steps
config/                Environment files and validated runtime configuration
test-runner/           TypeScript wrapper around the Cucumber CLI
utils/                 Home for reusable framework helpers
reports/               Generated Cucumber HTML report
screenshots/           Screenshots captured for failed scenarios
cucumber.js            Cucumber feature, TypeScript, and formatter configuration
playwright.config.ts   Browser launch settings consumed by the hooks
tsconfig.json          TypeScript compiler and ts-node settings
package.json           Dependencies and npm commands
README.md              Setup and execution guide
```

## Project Architecture

```text
features/                 Gherkin scenarios and tags
src/steps/                Playwright-BDD Given/When/Then implementations
src/pages/                Page Object Model selectors and interactions
src/fixtures/             Shared page-object fixtures
config/                   Environment files and validated runtime settings
utils/config.ts           Runtime settings consumed by Playwright config
playwright.config.ts      Feature discovery, browser, and reporter configuration
.features-gen/            Generated tests (created by bddgen)
allure-results/           Allure reporter output
test-results/             Playwright results, screenshots, video, and traces
package.json              Dependencies and npm scripts
README.md                 Setup and execution guide
```

Feature files describe behavior using Gherkin. Step definitions connect those steps to reusable page objects. The fixture file provides page objects to each scenario, and Playwright-BDD generates runnable tests before Playwright executes them.

## Installation

```sh
npm ci
npx playwright install chromium
```

## Environment Configuration

`config/.env.qa` and `config/.env.uat` contain the SauceDemo URL and demo credentials. Select one with `TEST_ENV=qa` or `TEST_ENV=uat`. The default is `qa`. You can override values with process environment variables:

```text
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
```

PowerShell example:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd
```

## Running Tests

Run all feature scenarios:

```sh
npm run test:bdd
```

Run a specific scenario or feature by its title:

```sh
npm run test:bdd -- --grep "Add a product to the cart"
```

Run scenarios tagged `@smoke`:

```sh
npm run test:bdd:smoke
```

Run in headed mode:

```sh
npm run test:bdd:headed
```

Generate the Playwright HTML report:

```sh
npm run test:bdd:html
```

The HTML report is written to `playwright-report/index.html`. Allure results are written to `allure-results/`.

## Failure Artifacts

Playwright captures a screenshot on failure and retains video and trace data according to `playwright.config.ts`. These artifacts are written under `test-results/`; the GitHub Actions workflow uploads test artifacts after each run.

## End-to-End Flow

```text
Feature File
     ↓
Playwright-BDD Generator (bddgen)
     ↓
Generated Playwright Test
     ↓
Step Definition
     ↓
Fixture and Page Object
     ↓
Playwright
     ↓
Browser and SauceDemo
     ↓
Playwright / Allure Report
```

The original Cucumber scaffold is retained separately and can be run with `npm run test:bdd:cucumber`.

The feature file describes behavior in Gherkin. Step definitions bind those sentences to methods on `LoginPage`. Cucumber creates a new typed World for each scenario; hooks put that scenario's Playwright browser, BrowserContext, Page, and page object on the World.

## Installation

```sh
npm install
npx playwright install chromium
```

The framework defaults to Chromium. To use another engine, install it with `npx playwright install firefox` or `npx playwright install webkit`, then select it with `BROWSER`.

## Environment Configuration

`config/.env.qa` and `config/.env.uat` contain the SauceDemo URL and the public demo account values supplied for this project. Replace these values with the appropriate test environment when adapting the framework. Do not put real secrets in source control.

Select an environment with `TEST_ENV=qa` or `TEST_ENV=uat`. Optional process variables override values loaded from the selected file:

```text
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
BROWSER=chromium
HEADLESS=true
TIMEOUT_MS=10000
```

PowerShell example:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd
```

## Running Tests

Run every feature:

```sh
npm run test:bdd
```

Run one feature:

```sh
npm run test:bdd -- features/login.feature
```

Run a tagged scenario or group of scenarios:

```sh
npm run test:bdd -- --tags "@smoke"
npx cucumber-js --tags "@regression"
```

Run in headed mode:

```sh
npm run test:bdd:headed
```

Generate the HTML report (the standard BDD command also writes this report):

```sh
npm run test:bdd:html
```

Open `reports/cucumber-report.html` after the run. The report includes feature/scenario names, step statuses, duration, and failure details.

## Failure Screenshots

The `After` hook checks the Cucumber scenario result. For a failed scenario it saves a full-page PNG under `screenshots/`, attaches that image to the Cucumber result, and attaches the failure message when available. The HTML formatter renders the attached image. The hook closes the Page, BrowserContext, and Browser in a `finally` block, including after a capture error.

## End-to-End Flow

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

Cucumber parses each feature and invokes the matching step definition. The step calls the Page Object, which uses Playwright's Page and locators to interact with SauceDemo. Hooks isolate and clean up browser resources for each scenario, while Cucumber's HTML formatter records results and attached failure screenshots.