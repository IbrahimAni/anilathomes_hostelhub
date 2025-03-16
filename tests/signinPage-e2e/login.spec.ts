import { test, expect } from "@playwright/test";
import { testData as LoginData } from "@/tests-utils/data/testData";
import { genStudentTestUserWithCompletedProfile } from "@/tests-utils/helpers/generateTestUserData/studentUserData";
import { genAgentTestUser } from "@/tests-utils/helpers/generateTestUserData/agentUserData";
import { genBusinessTestUser } from "@/tests-utils/helpers/generateTestUserData/businessUserData";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

test.describe("Login suite", () => {
  const {studentEmail, agentEmail, businessEmail, validPassword} = LoginData;
  const testData = {
    invalidEmail: "invalidEmail@invalidEmail",
    invalidPassword: "invalidPassword",
    validEmail: "test@test.com",
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

  test("login as a student", async ({ page }) => {
    const {email} = await genStudentTestUserWithCompletedProfile();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*student/);
  });

  test("login as an agent", async ({ page }) => {
    const {email} = await genAgentTestUser();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*agent/);
  });

  test("login as a business", async ({ page }) => {
    const {email} = await genBusinessTestUser();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*business/);
  });

  test("Unable to login as a student and try to access agent dashboard", async ({ page }) => {
    const {email} = await genStudentTestUserWithCompletedProfile();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*student/);
    
    // Try to navigate to agent dashboard directly
    await page.goto("/dashboard/agent");
    // Verify we are redirected back to student dashboard
    await expect(page).toHaveURL(/.*student/);
  });

  test("Unable to login as a student and try to access business dashboard", async ({ page }) => {
    const {email} = await genStudentTestUserWithCompletedProfile();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*student/);
    
    // Try to navigate to business dashboard directly
    await page.goto("/dashboard/business");
    // Verify we are redirected back to student dashboard
    await expect(page).toHaveURL(/.*student/);
  });

  test("Unable to login as an agent and try to access student dashboard", async ({ page }) => {
    const {email} = await genAgentTestUser();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*agent/);
    
    // Try to navigate to student dashboard directly
    await page.goto("/dashboard/student");
    // Verify we are redirected back to agent dashboard
    await expect(page).toHaveURL(/.*agent/);
  });

  test("Unable to login as an agent and try to access business dashboard", async ({ page }) => {
    const {email} = await genAgentTestUser();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*agent/);
    
    // Try to navigate to business dashboard directly
    await page.goto("/dashboard/business");
    // Verify we are redirected back to agent dashboard
    await expect(page).toHaveURL(/.*agent/);
  });

  test("Unable to login as a business and try to access student dashboard", async ({ page }) => {
    const {email} = await genBusinessTestUser();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*business/);
    
    // Try to navigate to student dashboard directly
    await page.goto("/dashboard/student");
    // Verify we are redirected back to business dashboard
    await expect(page).toHaveURL(/.*business/);
  });

  test("Unable to login as a business and try to access agent dashboard", async ({ page }) => {
    const {email} = await genBusinessTestUser();
    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*business/);
    
    // Try to navigate to agent dashboard directly
    await page.goto("/dashboard/agent");
    // Verify we are redirected back to business dashboard
    await expect(page).toHaveURL(/.*business/);
  });

   test.afterAll(async () => {
      await cleanupTestUsers();
    });
});
