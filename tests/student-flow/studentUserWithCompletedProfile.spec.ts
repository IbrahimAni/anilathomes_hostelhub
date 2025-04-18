import { test, expect } from "@playwright/test";
import { genStudentTestUserWithCompletedProfile } from "@/tests-utils/helpers/gen/generateTestUserData/studentUserData";
import { testData } from "@/tests-utils/data/testData";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

let student_email: string = "";
const { validPassword } = testData;

test.describe("Student User with Completed Profile", () => {
  test.beforeEach(async ({ page }) => {
    const result = await genStudentTestUserWithCompletedProfile();
    student_email = result.email;

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    await page.getByTestId("email-input").fill(student_email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
  });

  test("should not display modal to complete profile", async ({ page }) => {
    await page.waitForURL(/.*student/);

    await expect(
      page
        .getByTestId("new-user-overlay")
        .getByRole("heading", { name: "Complete Your Profile" })
    ).not.toBeVisible();
  });

  test("should not display banner to complete profile", async ({ page }) => {
    await page.waitForURL(/.*student/);
    await expect(page.getByText('Complete your profile to see')).not.toBeVisible();
  await expect(page.getByRole("button", {name: "Complete Your Profile"})).not.toBeVisible();
  });

  test("get started section should not be visible", async ({ page }) => {
    await page.waitForURL(/.*student/);
    await expect(
      page.getByRole("heading", { name: "Getting Started" })
    ).not.toBeVisible();
  });

  test("banner should display welcome message and user's name and view profile button", async ({
    page,
  }) => {
    await expect(page.getByTestId("welcome-heading")).toContainText(
      "Welcome back, Ipsum Manifest"
    );
    await expect(page.getByTestId("complete-profile-button")).toBeVisible();
  });

  test("should navigate to the view profile page when the button is clicked on the banner", async ({
    page,
  }) => {
    await page.getByTestId("complete-profile-button").click();
    await expect(page).toHaveURL(/.*profile/);
    await expect(
      page.getByRole("heading", { name: "My Profile" })
    ).toBeVisible();
  });

  test("should display recent activity section and upcoming payment section with empty data", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Recent Activity" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Upcoming Payments" })
    ).toBeVisible();
    await expect(page.getByText("No recent activity")).toBeVisible();
    await expect(page.getByText("No upcoming payments")).toBeVisible();
  });

  test("should display user display name and university name in the sidebar", async ({
    page,
  }) => {
    await expect(page.getByTestId("user-display-name")).toHaveText(
      "Ipsum Manifest"
    );
    await expect(page.getByTestId("user-university")).toHaveText(
      "unilag"
    );
  });

  test.afterAll(async () => {
    await cleanupTestUsers();
  });
});
