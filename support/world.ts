import type { Browser, BrowserContext, Page } from "playwright";
import { World } from "@cucumber/cucumber";
import type { LoginPage } from "../pages/LoginPage";

// Cucumber creates one World per scenario so browser state stays isolated.
export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;

  getLoginPage(): LoginPage {
    if (!this.loginPage) {
      throw new Error("LoginPage is not initialized. Check that the Before hook completed.");
    }
    return this.loginPage;
  }
}