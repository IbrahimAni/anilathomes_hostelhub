import {test, expect} from "@playwright/test";
import {testData} from "@/tests-utils/data/testData";
import {genStudentTestUserWithCompletedProfile} from "@/tests-utils/helpers/gen/generateTestUserData/studentUserData";
import {cleanupTestUsers} from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

test.describe("Student bookings", () => {
    test.beforeEach(async ({page}) => {
        const {validPassword} = testData;
        const {email} = await genStudentTestUserWithCompletedProfile();

        await page.goto("/login");
        await expect(page).toHaveURL(/.*login/);

        await page.getByTestId("email-input").fill(email);
        await page.getByTestId("password-input").fill(validPassword);
        await page.getByTestId("submit-button").click();
        await expect(page).toHaveURL(/.*student/);

        await page.goto("/dashboard/student/bookings");
        await expect(page).toHaveURL(/.*bookings/);
    });

    test("Bookings page should load with correct title and and be empty", async ({page}) => {
        await expect(page.getByRole("heading", {name: "My Bookings", exact: true})).toBeVisible();
        await expect(page.getByRole("heading", {name: "No bookings found", exact: true})).toBeVisible();
        await expect(page.getByTestId("empty-bookings")).toBeVisible();
        await expect(page.getByTestId("empty-bookings")).toHaveText(/You haven't made any hostel bookings yet/);

        await page.getByTestId("filter-active").click();
        await expect(page.getByTestId("empty-bookings")).toHaveText(/You don't have any active bookings/);

        await page.getByTestId("filter-upcoming").click();
        await expect(page.getByTestId("empty-bookings")).toHaveText(/You don't have any upcoming bookings/);

        await page.getByTestId("filter-completed").click();
        await expect(page.getByTestId("empty-bookings")).toHaveText(/You don't have any completed bookings/);
    });

    test.afterAll(async () => {
        await cleanupTestUsers();
    });
});