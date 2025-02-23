import { invalidData } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";
import { test, expect } from "@playwright/test";

test.describe("Login suite", () => {
  const testData = {
    invalidEmail: "invalidEmail@invalidEmail",
    invalidPassword: "invalidPassword",
    validEmail: "test@test.com",
    validPassword: "",
  };

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);
  });

  test("Navigate to signup page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(
      page.getByRole("heading", { name: "Create your account" })
    ).toBeVisible();
  });

  test("Login with empty credentials", async ({ page }) => {
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("email-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toBeVisible();
  });

  test("Login with invalid email credentials", async ({ page }) => {
    await page.getByTestId("email-input").fill(testData.invalidEmail);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("email-error")).toBeVisible();
    await expect(page.getByTestId("email-error")).toHaveText("Invalid email address");
  });
});
