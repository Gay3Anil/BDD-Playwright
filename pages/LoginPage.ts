import assert from "node:assert/strict";
import type { Locator, Page } from "playwright";
import { testConfig } from "../config/config";

// The Page Object Model keeps selectors and browser interactions out of step definitions.
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly inventoryContainer: Locator;
  readonly loginError: Locator;

  constructor(private readonly page: Page) {
    // Page is Playwright's tab-level API for navigation, locators, and user interactions.
    this.usernameInput = page.locator("[data-test='username']");
    this.passwordInput = page.locator("[data-test='password']");
    this.loginButton = page.locator("[data-test='login-button']");
    this.inventoryContainer = page.locator("[data-test='inventory-container']");
    this.loginError = page.locator("[data-test='error']");
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(testConfig.baseUrl);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.inventoryContainer.waitFor({ state: "visible" });
    assert.match(this.page.url(), /\/inventory\.html$/, "Expected the inventory page after login.");
  }

  async verifyLoginError(): Promise<void> {
    await this.loginError.waitFor({ state: "visible" });
    const message = (await this.loginError.innerText()).trim();
    assert.ok(message, "Expected a visible login error message.");
  }
}