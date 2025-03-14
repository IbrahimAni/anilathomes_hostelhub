import { test, expect } from "@playwright/test";
import { testData as SignUpData } from "@/tests-utils/data/testData";
import { genRandomNumber } from "@/tests-utils/helpers/genRandomNumber";

test.describe("Signup test suite", () => {
  const {
    invalidEmail,
    validEmail,
    pwdLessThen8,
    pwdWithoutUppercase,
    pwdWithoutLowercase,
    validPassword,
    unmatchedConfirmPassword,
    studentEmail,
    agentEmail,
    businessEmail
  } = SignUpData;

  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveURL(/.*signup/);
  });

  test("Signup with valid credentials as a student", async ({ page }) => {
    const randomEmail = studentEmail.replace('@', `${genRandomNumber()}@`);
    await page.getByTestId("email-input").fill(randomEmail);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("confirm-password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await page.getByTestId("role-student").click();
    await expect(page).toHaveURL(/.*student/);
    await expect(page.getByRole('heading', { name: 'Welcome to HostelHub!' })).toBeVisible();
  });

  test("Signup with valid credentials as an agent", async ({ page }) => {
    const randomEmail = agentEmail.replace('@', `${genRandomNumber()}@`);
    await page.getByTestId("email-input").fill(randomEmail);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("confirm-password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await page.getByTestId("role-agent").click();
    await expect(page).toHaveURL(/.*agent/);  });

  test("Signup with valid credentials as a business", async ({ page }) => {
    const randomEmail = businessEmail.replace('@', `${genRandomNumber()}@`);
    await page.getByTestId("email-input").fill(randomEmail);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("confirm-password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await page.getByTestId("role-business").click();
    await expect(page).toHaveURL(/.*business/);  });

  test("Can't signup with existing email", async ({ page }) => {    
    // Try to register with the same email
    await page.getByTestId("email-input").fill(studentEmail);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("confirm-password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    
    // Expect to see an error message
    await expect(page.getByTestId("form-error")).toBeVisible();
    await expect(page.getByTestId("form-error")).toContainText("email-already-in-use");
  });

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
    await page.getByTestId("email-input").fill(invalidEmail);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("email-error")).toBeVisible();
    await expect(page.getByTestId("email-error")).toHaveText(
      "Invalid email address"
    );
  });

  test("Signup with invalid password credentials", async ({ page }) => {
    await page.getByTestId("email-input").fill(validEmail);
    await page.getByTestId("password-input").fill(pwdLessThen8);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("password-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toHaveText(
      "Password must be at least 8 characters"
    );
  });

  test("Signup with password without uppercase", async ({ page }) => {
    await page.getByTestId("email-input").fill(validEmail);
    await page.getByTestId("password-input").fill(pwdWithoutUppercase);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("password-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toHaveText(
      "Password must contain at least one uppercase letter"
    );
  });

  test("Signup with password without lowercase", async ({ page }) => {
    await page.getByTestId("email-input").fill(validEmail);
    await page.getByTestId("password-input").fill(pwdWithoutLowercase);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("password-error")).toBeVisible();
    await expect(page.getByTestId("password-error")).toHaveText(
      "Password must contain at least one lowercase letter"
    );
  });

  test("Signup with unmatched confirm password", async ({ page }) => {
    await page.getByTestId("email-input").fill(validEmail);
    await page.getByTestId("password-input").fill(validPassword);
    await page
      .getByTestId("confirm-password-input")
      .fill(unmatchedConfirmPassword);
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("confirm-password-error")).toBeVisible();
    await expect(page.getByTestId("confirm-password-error")).toHaveText(
      "Passwords don't match"
    );
  });
});
