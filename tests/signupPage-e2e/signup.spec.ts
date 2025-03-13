import { test, expect } from "@playwright/test";

test.describe("Signup test suite", () => {
  const testData = {
    invalidEmail: "invalidEmail@invalidEmail",
    invalidPassword: "invalidPassword",
    pwdLessThen8: "1234567",
    pwdWithoutUppercase: "12345678",
    pwdWithoutLowercase: "ABCDEFGH",
    validEmail: "test@domain.com",
    studentEmail: "student@anilathomes.com",
    agentEmail: "agent@anilathomes.com",
    businessEmail: "business@anilathomes.com",
    validPassword: "Password.123$",
    confirmPassword: "Password.123$",
    unmatchedConfirmPassword: "Password1234",
  };

  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveURL(/.*signup/);
  });

  test.skip("Signup with valid credentials as a student", async ({
    page,
  }) => {});

  test.skip("Signup with valid credentials as an agent", async ({
    page,
  }) => {});

  test.skip("Signup with valid credentials as a business", async ({
    page,
  }) => {});

  test.skip("Can't signup with existing email", async ({ page }) => {});

  test("Navigate to sign in page", async ({ page }) => {
    await page.getByTestId("signin-link").click();
    await expect(
      page.getByRole("heading", { name: "Sign in to your account" })
    ).toBeVisible();
  });

  test("Signup with empty credentials", async ({ page }) => {
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("email-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toBeVisible();
  });

  test("Signup with invalid email credentials", async ({ page }) => {
    await page.getByTestId("email-input").fill(testData.invalidEmail);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("email-error")).toBeVisible();
    await expect(page.getByTestId("email-error")).toHaveText(
      "Invalid email address"
    );
  });

  test("Signup with invalid password credentials", async ({ page }) => {
    await page.getByTestId("email-input").fill(testData.validEmail);
    await page.getByTestId("password-input").fill(testData.pwdLessThen8);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("password-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toHaveText(
      "Password must be at least 8 characters"
    );
  });

  test("Signup with password without uppercase", async ({ page }) => {
    await page.getByTestId("email-input").fill(testData.validEmail);
    await page.getByTestId("password-input").fill(testData.pwdWithoutUppercase);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("password-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toHaveText(
      "Password must contain at least one uppercase letter"
    );
  });

  test("Signup with password without lowercase", async ({ page }) => {
    await page.getByTestId("email-input").fill(testData.validEmail);
    await page.getByTestId("password-input").fill(testData.pwdWithoutLowercase);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("password-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toHaveText(
      "Password must contain at least one lowercase letter"
    );
  });

  test("Signup with unmatched confirm password", async ({ page }) => {
    await page.getByTestId("email-input").fill(testData.validEmail);
    await page.getByTestId("password-input").fill(testData.validPassword);
    await page
      .getByTestId("confirm-password-input")
      .fill(testData.unmatchedConfirmPassword);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("confirm-password-error")).toBeVisible();
    await expect(page.getByTestId("confirm-password-error")).toHaveText(
      "Passwords don't match"
    );
  });
});
