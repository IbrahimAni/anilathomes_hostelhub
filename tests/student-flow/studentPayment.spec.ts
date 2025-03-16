import { test, expect } from "@playwright/test";
import { testData } from "@/tests-utils/data/testData";
import { genStudentTestUserWithCompletedProfile } from "@/tests-utils/helpers/generateTestUserData/studentUserData";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

test.describe("Student Payment Flow", () => {
    test.beforeEach(async ({ page }) => {
        const {validPassword} = testData;
        const {email} = await genStudentTestUserWithCompletedProfile();

        await page.goto("/login");
        await expect(page).toHaveURL(/.*login/);

        await page.getByTestId("email-input").fill(email);
        await page.getByTestId("password-input").fill(validPassword);
        await page.getByTestId("submit-button").click();
        await expect(page).toHaveURL(/.*student/);

        await page.goto("/dashboard/student/payments");
        await expect(page).toHaveURL(/.*payments/);
    });

    test("Payments page should load with correct title and be empty", async ({ page }) => {
        await expect(page.getByTestId("transaction-counter")).toHaveText(/0 Transactions/)
        await expect(page.getByRole("heading", { name: "Payment History", exact: true })).toBeVisible();
        await expect(page.getByTestId("empty-payment-state")).toBeVisible();
        await expect(page.getByTestId("empty-payment-state")).toHaveText(/You haven't made any payments yet/);

        await page.getByTestId("filter-all").click();
        await expect(page.getByTestId("empty-payment-state")).toHaveText(/You haven't made any payments yet/);

        await page.getByTestId("filter-pending").click();
        await expect(page.getByTestId("empty-payment-state")).toHaveText(/You don't have any pending payments/);

        await page.getByTestId("filter-successful").click();
        await expect(page.getByTestId("empty-payment-state")).toHaveText(/You don't have any successful payments/);

        await page.getByTestId("filter-failed").click();
        await expect(page.getByTestId("empty-payment-state")).toHaveText(/You don't have any failed payments/);
    });

    test.afterAll(async () => {
        await cleanupTestUsers();
    });
});