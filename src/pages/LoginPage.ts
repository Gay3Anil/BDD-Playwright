import { expect, type Locator, type Page } from "@playwright/test";
import { Config } from "../../utils/config";

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly inventoryContainer: Locator;
  readonly loginError: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator("[data-test='username']");
    this.passwordInput = page.locator("[data-test='password']");
    this.loginButton = page.locator("[data-test='login-button']");
    this.inventoryContainer = page.locator("[data-test='inventory-container']");
    this.loginError = page.locator("[data-test='error']");
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(Config.baseUrl);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async enterValidCredentials(): Promise<void> {
    await this.enterCredentials(Config.username, Config.password);
  }

  async enterInvalidCredentials(): Promise<void> {
    await this.enterCredentials(`${Config.username}_invalid`, Config.password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
  }

  async verifyLoginError(): Promise<void> {
    await expect(this.loginError).toContainText("Username and password do not match");
  }
}