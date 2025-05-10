import { test, expect } from "@/tests-utils/fixtures/base";
import { testData } from "@/tests-utils/data/testData";
import { genBusinessWithProperty } from "@/tests-utils/helpers/gen/genBusinessData/genBusinessWithProperties";
import {IProperty} from "@/types/property";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../..');

let property: IProperty;

test.describe("Edit Property", () => {
  test.beforeEach(async ({ page }) => {
    const { validPassword } = testData;
    const response = await genBusinessWithProperty();
    const { email } = response;
    property = response.property;

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
    await page.getByTestId(`edit-property`).click();
    await expect(page.getByTestId("edit-hostel-drawer")).toBeVisible();
  });

  test("should edit the property details", async ({ page }) => {
    const { hostelImgs } = testData;
    const hostelName = "Large Hostel";

    await page.getByTestId(`edit-property`).click();
    await expect(page.getByTestId("edit-hostel-drawer")).toBeVisible();

    // Edit the property details
    await page.getByRole('textbox', { name: 'Property Name *' }).fill(hostelName);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByTestId("property-images").setInputFiles(path.resolve(rootDir, hostelImgs.img1Path));
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Update Property' }).click();
    await expect(page.getByText("Property updated successfully!")).toBeVisible();
    await expect(page.getByRole('heading', { name: hostelName })).toBeVisible();
  });
});
