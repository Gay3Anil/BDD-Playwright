import { expect, type Page } from "@playwright/test";

export class CartPage {
  constructor(private readonly page: Page) {}

  async verifyContainsProduct(productName: string): Promise<void> {
    const productNameLocator = this.page.locator("[data-test='inventory-item-name']", {
      hasText: productName
    });
    await expect(productNameLocator).toBeVisible();
  }
}