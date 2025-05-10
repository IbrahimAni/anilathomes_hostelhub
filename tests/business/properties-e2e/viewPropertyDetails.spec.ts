import { test, expect } from "@/tests-utils/fixtures/base";
import { testData } from "@/tests-utils/data/testData";
import { genBusinessWithProperty } from "@/tests-utils/helpers/gen/genBusinessData/genBusinessWithProperties";
import { IProperty } from "@/types/property";

let property: IProperty;

test.describe("View Property Details", () => {
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
    await page.getByTestId("view-details").click();
  });

  test("should display the property details", async ({ page }) => {
    await expect(page.getByRole('heading', { name: property.name })).toBeVisible();
    await expect(page.getByText(property.description)).toBeVisible();

    //validate price is in naira and make sure it's visible
    await expect(page.getByText(`${property.price}`)).toBeVisible();

    // validate the amenities
    for (const amenity of property.amenities) {
      await expect(page.getByText(amenity)).toBeVisible();
    }   

    //validate the contact details
    await expect(page.getByText(property.contact.email)).toBeVisible();
    await expect(page.getByText(property.contact.phone)).toBeVisible();

    // validate the total number of rooms
    await expect(page.getByTestId("total-rooms")).toHaveText(property.availableRooms.toString());
    await expect(page.getByTestId("available-rooms")).toHaveText(property.availableRooms.toString());
    await expect(page.getByTestId("occupied-rooms")).toHaveText("0");
  });


  test("should not have agent assigned", async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'No Agents Assigned' })).toBeVisible();
    await expect(page.getByText("No agent commissions found")).toBeVisible();
  });
});
