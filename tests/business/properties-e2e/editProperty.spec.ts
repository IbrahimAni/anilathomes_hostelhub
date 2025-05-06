import { test, expect } from "@/tests-utils/fixtures/base";
import { testData } from "@/tests-utils/data/testData";
import { genBusinessWithProperties } from "@/tests-utils/helpers/gen/genBusinessData/genBusinessWithProperties";

test.describe("Edit Property", () => {
  test.beforeEach(async ({ page }) => {
    const { validPassword } = testData;
    const { email } = await genBusinessWithProperties();

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*business/, { timeout: 60000 });

    await page.goto("/dashboard/business/properties");
    await expect(page).toHaveURL(/.*properties/);
  });

  test("should open the edit property modal", async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'High End Hostel' })).toBeVisible();
  });
});
