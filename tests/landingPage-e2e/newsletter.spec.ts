import { test, expect } from '@playwright/test';

test.describe('Newsletter Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

//   test('should display validation error for invalid email format', async ({ page }) => {
//     const emailInput = page.getByTestId('email-input');
//     const subscribeButton = page.getByTestId('subscribe-button');

//     await emailInput.fill('invalid-email');
//     await subscribeButton.click();

//     const errorMessage = page.getByTestId('email-error');
//     await expect(errorMessage).toBeVisible();
//     await expect(errorMessage).toHaveText('Invalid email address');
//   });

  test('should show error for already subscribed email', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');
    const subscribeButton = page.getByTestId('subscribe-button');

    await emailInput.fill('test@example.com');
    await subscribeButton.click();

    const errorMessage = page.getByTestId('email-error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('This email is already subscribed');
  });

  test('should show success message for valid new email', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');
    const subscribeButton = page.getByTestId('subscribe-button');

    await emailInput.fill('new-user@example.com');
    await subscribeButton.click();

    const successMessage = page.getByTestId('success-message');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText('Successfully subscribed!');
  });

  test('should show required field error when email is empty', async ({ page }) => {
    const subscribeButton = page.getByTestId('subscribe-button');
    await subscribeButton.click();

    const errorMessage = page.getByTestId('email-error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Email is required');
  });
});