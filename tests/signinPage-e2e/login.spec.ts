import { test, expect } from "@playwright/test";
import { testData as LoginData } from "@/tests-utils/data/testData";

test.describe("Login suite", () => {
  const {studentEmail, agentEmail, businessEmail} = LoginData;
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

  test.skip("login as a student", async ({ page }) => {});

  test.skip("login as an agent", async ({ page }) => {});

  test.skip("login as a business", async ({ page }) => {});

  test.skip("Login as a student and try to access agent dashboard", async ({ page }) => {});

  test.skip("Login as a student and try to access business dashboard", async ({ page }) => {});

  test.skip("Login as an agent and try to access student dashboard", async ({ page }) => {});

  test.skip("Login as an agent and try to access business dashboard", async ({ page }) => {});

  test.skip("Login as a business and try to access student dashboard", async ({ page }) => {});

  test.skip("Login as a business and try to access agent dashboard", async ({ page }) => {});
});
