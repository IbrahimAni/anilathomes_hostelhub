import { test, expect } from "@/tests-utils/fixtures/base";
import { testData } from "@/tests-utils/data/testData";
import { genBusinessTestUser } from "@/tests-utils/helpers/gen/generateTestUserData/businessUserData";

test.describe("Add Property", () => {
  test.beforeEach(async ({ page }) => {
    const { validPassword } = testData;
    const { email } = await genBusinessTestUser();

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    await page.getByTestId("email-input").fill(email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL(/.*business/, { timeout: 60000 });

    await page.goto("/dashboard/business/properties");
    await expect(page).toHaveURL(/.*properties/);
  });

  test("should display the add property button", async ({ page }) => {
    await expect(page.getByTestId("add-first-property-button")).toBeVisible();
  });

  test("should open the add property modal", async ({ page }) => {
    await page.getByTestId("add-first-property-button").click();
    await expect(
      page.getByRole("heading", { name: "Add New Hostel" })
    ).toBeVisible();
  });

  test("should fill in the property details and submit", async ({
    page,
    addPropertyPage,
  }) => {
    const { hostelImgs } = testData;
    const hostelName = "Sunset Hostel";

    await page.getByTestId("add-first-property-button").click();
    await addPropertyPage.fillPropertyDetailsStep1(
      hostelName,
      "A cozy place to stay",
      "123 Sunset Blvd",
      "Kwara",
      "Ilorin",
      "Nigeria",
      [hostelImgs.img1Path]
    );
    await addPropertyPage.clickNextStepButton();
    await addPropertyPage.fillPropertyDetailsStep2(200000, 10, [
      "Single",
      "Double",
    ]);
    await addPropertyPage.clickNextStepButton();
    await addPropertyPage.fillPropertyDetailsStep3(["Wi-Fi", "Laundry"]);
    await addPropertyPage.clickReviewButton();
    await addPropertyPage.clickConfirmButton();

    await expect(page.getByTestId(`property-tab-${hostelName}`)).toBeVisible();
    await expect(page.getByTestId("totalRoomCountSummary")).toHaveText("10");
    await expect(page.getByTestId("availableRoomCountSummary")).toHaveText("10");
    await expect(page.getByTestId("occupiedRoomCountSummary")).toHaveText("0");

  });

  test("should validate the input fields when its empty", async ({ page }) => {
    await page.getByTestId("add-first-property-button").click();
    await expect(
      page.getByRole("heading", { name: "Add New Hostel" })
    ).toBeVisible();

    await page.getByTestId("next-step-button").click();
    await expect(page.getByText("Hostel name is required")).toBeVisible();
    await expect(page.getByText("Description is required")).toBeVisible();
    await expect(page.getByText("State is required")).toBeVisible();
    await expect(
      page.getByText("At least one image is required")
    ).toBeVisible();
  });

  test("should validate the input fields when its empty for step 2", async ({page, addPropertyPage}) => {
    const { hostelImgs } = testData;
    const hostelName = "Sunset Hostel";

    await page.getByTestId("add-first-property-button").click();
    await addPropertyPage.fillPropertyDetailsStep1(
      hostelName,
      "A cozy place to stay",
      "123 Sunset Blvd",
      "Kwara",
      "Ilorin",
      "Nigeria",
      [hostelImgs.img1Path]
    );
    await addPropertyPage.clickNextStepButton();
    await page.getByTestId("roomType-Single").click();
    await addPropertyPage.clickNextStepButton();

    await expect(page.getByText("Price must be greater than zero")).toBeVisible();
    await expect(page.getByText("Please select at least one room type")).toBeVisible();
    await expect(page.getByText("Number of available rooms must be greater than zero")).toBeVisible();
  })
});
