import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { testConfig } from "../config/config";
import type { CustomWorld } from "../support/world";

// Step definitions connect readable Gherkin sentences to reusable page-object behavior.
Given("I navigate to the login page", async function (this: CustomWorld) {
  await this.getLoginPage().navigateToLoginPage();
});

When("I enter valid username and password", async function (this: CustomWorld) {
  const loginPage = this.getLoginPage();
  await loginPage.enterUsername(testConfig.username);
  await loginPage.enterPassword(testConfig.password);
});

When("I enter invalid username and password", async function (this: CustomWorld) {
  const loginPage = this.getLoginPage();
  await loginPage.enterUsername(`${testConfig.username}_invalid`);
  await loginPage.enterPassword(testConfig.password);
});

When("I click the login button", async function (this: CustomWorld) {
  await this.getLoginPage().clickLogin();
});

Then("I should be successfully logged in", async function (this: CustomWorld) {
  await this.getLoginPage().verifySuccessfulLogin();
});

Then("I should see a login error message", async function (this: CustomWorld) {
  await this.getLoginPage().verifyLoginError();
  const errorText = await this.getLoginPage().loginError.innerText();
  assert.match(errorText, /Username and password do not match/i);
});