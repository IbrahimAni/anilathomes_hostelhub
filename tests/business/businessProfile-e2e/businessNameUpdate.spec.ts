import { test, expect } from "@playwright/test";
import { testData } from "@/tests-utils/data/testData";
import { genBusinessTestUser } from "@/tests-utils/helpers/gen/generateTestUserData/businessUserData";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

test.describe("New Business User", () => {
  test.beforeEach(async ({ page }) => {
    const { validPassword } = testData;
    const { email } = await genBusinessTestUser();

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*business/, { timeout: 60000 });
  });

  test("should display the update business profile banner", async ({
    page,
  }) => {
    await expect(page.getByTestId("business-name-banner")).toBeVisible();
    await expect(
      page.getByTestId("business-name-banner-description")
    ).toContainText(
      /You're currently using the default business name. Personalize your experience by setting your actual business name./
    );
  });

  test("should display the default business name", async ({ page }) => {
    await expect(page.getByTestId("business-name-display")).toBeVisible();
    await expect(page.getByTestId("business-name-display")).toHaveText(
      /Business Name/
    );
  });

  test("should update business name and hide the update banner", async ({
    page,
  }) => {
    const { business } = testData;

    await page.getByTestId("update-business-name-button").click();
    await expect(page).toHaveURL(/.*profile/);

    await expect(
      page.getByRole("heading", { name: "Business Profile" })
    ).toBeVisible();
    await page
      .getByPlaceholder("Enter business name")
      .fill(business.business_name);

    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(
      page.getByText("Business profile updated successfully")
    ).toBeVisible();

    await expect(page.getByTestId("business-name-display")).toHaveText(
      business.business_name
    );
    await expect(page.getByTestId("business-profile-name")).toHaveText(
      business.business_name
    );

    await expect(page.getByTestId("business-name-banner")).not.toBeVisible();
  });

  test.afterAll(async () => {
    await cleanupTestUsers();
  });
});
