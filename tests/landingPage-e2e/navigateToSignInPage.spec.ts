import {test, expect} from '@playwright/test';
import {closeWelcomeDiscountModal} from "../../tests-utils/helpers/closeWelcomeModal";

test('Navigate to sign in page', async ({page}) => {
    await page.goto('/');

    // Close the welcome discount modal if it appears
    await closeWelcomeDiscountModal(page);

    // Click on the "Sign In" button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify the URL
    await expect(page).toHaveURL(/.*login/);
});