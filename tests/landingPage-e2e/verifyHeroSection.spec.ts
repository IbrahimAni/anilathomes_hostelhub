import { test, expect } from "@playwright/test";

test("verify hero section", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("hero-header")).toHaveText(
    "Find Your Perfect Hostel"
  );
  await expect(page.getByTestId("hero-subheader")).toHaveText(
    "Discover unique stays at the best prices worldwide"
  );
});
