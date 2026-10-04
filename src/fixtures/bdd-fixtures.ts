import { test as base } from "playwright-bdd";
import { CartPage } from "../pages/CartPage";
import { InventoryPage } from "../pages/InventoryPage";
import { LoginPage } from "../pages/LoginPage";

type BddFixtures = {
  cartPage: CartPage;
  inventoryPage: InventoryPage;
  loginPage: LoginPage;
};

export const test = base.extend<BddFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  }
});