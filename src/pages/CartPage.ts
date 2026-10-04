import { expect, type Page } from "@playwright/test";

export class CartPage {
  constructor(private readonly page: Page) {}

  async verifyContainsProduct(productName: string): Promise<void> {
    await expect(this.page.locator("[data-test='inventory-item-name']")).toContainText(productName);
  }
}