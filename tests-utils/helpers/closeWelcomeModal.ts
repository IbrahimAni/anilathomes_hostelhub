import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const closeWelcomeDiscountModal = async (page: Page) => {
    await expect(page.getByTestId("discount-modal-overlay")).toBeVisible();
    await page.getByTestId("discount-modal-close").click();
};
