import { createBdd } from "playwright-bdd";
import { test } from "../fixtures/bdd-fixtures";

const { Given, When, Then } = createBdd(test);

Given("I navigate to the login page", async ({ loginPage }) => {
  await loginPage.navigateToLoginPage();
});

Given("I am logged in as a standard user", async ({ loginPage }) => {
  await loginPage.navigateToLoginPage();
  await loginPage.enterValidCredentials();
  await loginPage.clickLogin();
  await loginPage.verifySuccessfulLogin();
});

When("I enter valid username and password", async ({ loginPage }) => {
  await loginPage.enterValidCredentials();
});

When("I enter invalid username and password", async ({ loginPage }) => {
  await loginPage.enterInvalidCredentials();
});

When("I click the login button", async ({ loginPage }) => {
  await loginPage.clickLogin();
});

Then("I should be successfully logged in", async ({ loginPage }) => {
  await loginPage.verifySuccessfulLogin();
});

Then("I should see a login error message", async ({ loginPage }) => {
  await loginPage.verifyLoginError();
});