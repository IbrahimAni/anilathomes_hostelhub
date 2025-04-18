import { test, expect } from "@playwright/test";
import { genStudentTestUser } from "@/tests-utils/helpers/gen/generateTestUserData/studentUserData";
import { testData } from "@/tests-utils/data/testData";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

let student_email: string = "";
const { validPassword } = testData;

test.describe("Student Onboarding Experience", () => {
  test.beforeEach(async ({ page }) => {
    // Create a test user with student role
    const result = await genStudentTestUser();
    student_email = result.email;

    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    await page.getByTestId("email-input").fill(student_email);
    await page.getByTestId("password-input").fill(validPassword);
    await page.getByTestId("submit-button").click();
  });

  test("User is prompted with the 'Complete Your Profile' modal", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Welcome to HostelHub!" })
    ).toBeVisible();
    await expect(
      page
        .getByTestId("new-user-overlay")
        .getByRole("heading", { name: "Complete Your Profile" })
    ).toBeVisible();
  });

  test("The modal contains incomplete profile progress", async ({ page }) => {
    await expect(
      page.getByTestId("profile-completion-percentage")
    ).toContainText("25%");
  });

  test("User logs in for the first time and sees their name displayed in the sidebar", async ({
    page,
  }) => {
    await page.getByTestId("dismiss-overlay").click();

    await expect(page.getByTestId("user-display-name")).toHaveText(
      "Ipsum Manifest"
    );
    await expect(page.getByTestId("welcome-heading")).toContainText(
      "Welcome to HostelHub, Ipsum Manifest"
    );
  });

  test("The dashboard has 'Getting Started' sections with cards and CTA to 'Complete Profile', 'Explore Hostels', and 'Book Now' ", async ({
    page,
  }) => {
    await page.getByTestId("dismiss-overlay").click();
    await expect(
      page.getByRole("heading", { name: "Getting Started" })
    ).toBeVisible();

    await expect(page.getByTestId("getting-started-item-1")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Complete Profile" })
    ).toBeVisible();

    await expect(page.getByTestId("getting-started-item-2")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Find Hostels" })
    ).toBeVisible();

    await expect(page.getByTestId("getting-started-item-3")).toBeVisible();
    await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
  });

  test("A banner exists prompting the user to complete their profile", async ({
    page,
  }) => {
    await page.getByTestId("dismiss-overlay").click();

    await expect(page.getByTestId("welcome-section")).toBeVisible();
    await expect(page.getByTestId("complete-profile-button")).toBeVisible();
    await expect(page.getByText("Complete your profile to see")).toContainText(
      "Complete your profile"
    );
  });

  test("New user has no saved hostels, active bookings and payments history", async ({
    page,
  }) => {
    await page.getByTestId("dismiss-overlay").click();

    await expect(page.getByTestId("favorites-card")).toBeVisible();
    await expect(page.getByTestId("favorites-count")).toHaveText("0");

    await expect(page.getByTestId("bookings-card")).toBeVisible();
    await expect(page.getByTestId("bookings-count")).toHaveText("0");

    await expect(page.getByTestId("payments-card")).toBeVisible();
    await expect(page.getByTestId("payments-count")).toHaveText("0");
  });

  test("Clicking 'Complete My Profile Now' redirects them to the profile page", async ({
    page,
  }) => {
    await page.getByTestId("go-to-profile-button").click();
    await expect(page).toHaveURL(/.*profile/);
    await expect(
      page.getByRole("heading", { name: "My Profile" })
    ).toBeVisible();

    await page.goto("/dashboard/student");
    await page.getByTestId("dismiss-overlay").click();
    await page.getByTestId("complete-profile-button").click();
    await expect(page).toHaveURL(/.*profile/);
    await expect(
      page.getByRole("heading", { name: "My Profile" })
    ).toBeVisible();

    await page.goto("/dashboard/student");
    await page.getByTestId("dismiss-overlay").click();
    await page.getByRole("button", { name: "Complete Profile" }).click();
    await expect(page).toHaveURL(/.*profile/);
    await expect(
      page.getByRole("heading", { name: "My Profile" })
    ).toBeVisible();
  });

  test("User has a default university name before profile completion ", async ({ page }) => {
    await page.getByTestId("dismiss-overlay").click();

    await expect(
      page.getByTestId('user-university')
    ).toHaveText("University Student");
  });

  test("Nav links in the sidebar are visible", async ({ page }) => {
    await page.getByTestId("dismiss-overlay").click();

    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-profile')).toBeVisible();
    await expect(page.getByTestId('nav-favorites')).toBeVisible();
    await expect(page.getByTestId("nav-bookings")).toBeVisible();
    await expect(page.getByTestId("nav-payments")).toBeVisible();
    await expect(page.getByTestId("nav-settings")).toBeVisible();
  });

  test.afterAll(async () => {
    await cleanupTestUsers();
  });
});
