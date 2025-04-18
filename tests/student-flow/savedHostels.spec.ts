import { test, expect } from "@playwright/test";
import { testData } from "@/tests-utils/data/testData";
import { genStudentTestUserWithCompletedProfile } from "@/tests-utils/helpers/gen/generateTestUserData/studentUserData";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

test.describe("Saved hostels", () => {
  test.beforeEach(async ({ page }) => {
    const { validPassword } = testData;
    const { email } = await genStudentTestUserWithCompletedProfile();

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*student/);

    await page.goto("/dashboard/student/favorites");
    await expect(page).toHaveURL(/.*favorites/);
  });

  test("Saved hostels page should load with correct title and count", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Saved Hostels", exact: true })
    ).toBeVisible();
    await expect(page.getByTestId("favorites-count")).toBeVisible();
    await expect(page.getByTestId("favorites-count")).toHaveText(/0 Saved/);
    await expect(page.getByTestId("empty-favorites-state")).toHaveText(/No saved hostels yet/);
  });

  test.afterAll(async () => {
    await cleanupTestUsers();
  });
});
