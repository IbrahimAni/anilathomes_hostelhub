import { test, expect } from "@playwright/test";
import { testData } from "@/tests-utils/data/testData";
import { genStudentTestUser } from "@/tests-utils/helpers/generateTestUserData/studentUserData";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

test.describe("Update Student Personal Information", () => {
  test.beforeEach(async ({ page }) => {
    const { validPassword } = testData;
    const { email } = await genStudentTestUser();

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*student/);

    await page.goto("/dashboard/student/profile");
    await expect(page).toHaveURL(/.*profile/);
  });

  test("click Save Changes button without filling the personal information", async ({
    page,
  }) => {
    await page.getByTestId("btn-save-profile").click();
    await expect(page.getByTestId("error-phoneNumber")).toContainText(
      "Phone number is required"
    );
    await expect(page.getByTestId("error-university")).toContainText(
      "Please select your university"
    );
    await expect(page.getByTestId("error-department")).toContainText(
      "Department is required"
    );
    await expect(page.getByTestId("error-level")).toContainText(
      "Please select your level"
    );
  });

  test("fill the personal information and click Save Changes button", async ({
    page,
  }) => {
    await page.getByTestId("input-phoneNumber").fill("+2348167820406");
    await page.getByTestId('select-university').selectOption('lasu');
    await page.getByTestId("input-department").fill("Computer Science");
    await page.getByTestId('select-level').selectOption('500');

    await page.getByTestId("btn-save-profile").click();
    await expect(page.getByText("Profile updated successfully!")).toBeVisible();
  });

  test.afterAll(async () => {
    await cleanupTestUsers();
  });
});
