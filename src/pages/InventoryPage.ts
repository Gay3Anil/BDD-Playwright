import { expect, type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator("[data-test='shopping-cart-badge']");
    this.cartLink = page.locator("[data-test='shopping-cart-link']");
  }

  async addProductToCart(productName: string): Promise<void> {
    const productId = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    await this.page.locator(`[data-test='add-to-cart-${productId}']`).click();
  }

  async verifyCartBadge(expectedCount: string): Promise<void> {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}