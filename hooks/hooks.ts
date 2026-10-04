import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { After, Before, Status, setDefaultTimeout, setWorldConstructor } from "@cucumber/cucumber";
import { chromium, firefox, webkit } from "playwright";
import type { BrowserType } from "playwright";
import playwrightConfig from "../playwright.config";
import { LoginPage } from "../pages/LoginPage";
import { CustomWorld } from "../support/world";

setWorldConstructor(CustomWorld);
setDefaultTimeout(playwrightConfig.timeout);

Before(async function (this: CustomWorld) {
  const browserTypes: Record<typeof playwrightConfig.browser, BrowserType> = {
    chromium,
    firefox,
    webkit
  };

  // Browser is the launched engine; each scenario gets its own browser, context, and page.
  this.browser = await browserTypes[playwrightConfig.browser].launch({
    headless: playwrightConfig.headless
  });

  // BrowserContext isolates cookies/storage; Page is the tab used by the page object.
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(playwrightConfig.timeout);
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: CustomWorld, { pickle, result }) {
  try {
    if (result?.status === Status.FAILED && this.page) {
      const screenshotsDirectory = resolve(process.cwd(), "screenshots");
      await mkdir(screenshotsDirectory, { recursive: true });
      const safeScenarioName = pickle.name.replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 80);
      const screenshotPath = resolve(
        screenshotsDirectory,
        `${safeScenarioName}-${Date.now()}.png`
      );
      const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });

      // Cucumber's HTML formatter embeds attachments, so failed-run screenshots appear in the report.
      await this.attach(screenshot, "image/png");
      if (result.message) {
        await this.attach(result.message, "text/plain");
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    try {
      await this.attach(`Unable to capture failure details: ${message}`, "text/plain");
    } catch {
      // Preserve the original scenario result if report attachment is unavailable.
    }
  } finally {
    await this.page?.close().catch(() => undefined);
    await this.context?.close().catch(() => undefined);
    await this.browser?.close().catch(() => undefined);
  }
});