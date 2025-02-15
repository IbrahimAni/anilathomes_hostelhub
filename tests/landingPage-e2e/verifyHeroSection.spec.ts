import { test, expect } from "@playwright/test";
import { closeWelcomeDiscountModal } from "../../tests-utils/helpers/closeWelcomeModal";

test("verify hero section", async ({ page }) => {
  await page.goto("/");
  await closeWelcomeDiscountModal(page);

  await expect(page.getByTestId("hero-header")).toHaveText(
    "Find Your Perfect Hostel"
  );
  await expect(page.getByTestId("hero-subheader")).toHaveText(
    "Discover unique stays at the best prices worldwide"
  );
});
