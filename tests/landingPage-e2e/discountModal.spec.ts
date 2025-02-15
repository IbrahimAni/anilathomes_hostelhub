import { test, expect } from '@playwright/test';

// Test suite for DiscountModal

// Test case: Verify that the discount modal opens and displays correctly
test('DiscountModal opens and displays correctly', async ({ page }) => {
  // Navigate to the page where the DiscountModal is used
  await page.goto('/');

  // Verify that the modal is visible
  await expect(page.getByTestId('discount-modal-overlay')).toBeVisible();

  // Verify the discount code is displayed
  await expect(page.getByTestId('discount-amount')).toHaveText('10% OFF');

  // Verify the timer is displayed
  await expect(page.getByTestId('discount-timer')).toBeVisible();

  // Close the modal
  await page.getByTestId('discount-modal-close').click();

  // Verify the modal is no longer visible
  await expect(page.getByTestId('discount-modal-overlay')).not.toBeVisible();
});

// Test case: Verify that the discount code can be copied to clipboard
test('Discount code can be copied to clipboard', async ({ page }) => {
  // Navigate to the page where the DiscountModal is used
  await page.goto('/');

   // Verify that the modal is visible
   await expect(page.getByTestId('discount-modal-overlay')).toBeVisible();
  
  // Click the copy button
//   await page.getByTestId('discount-copy-button').click();
  await page.getByRole("button", { name: "Copy" }).click();

  // Verify the copied message is displayed
  await expect(page.getByTestId("toast-success-message")).toBeVisible();
  await expect(page.getByTestId("toast-success-message")).toHaveText(" Discount code copied to clipboard!");
});
