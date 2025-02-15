import { test, expect } from '@playwright/test';
import { closeWelcomeDiscountModal } from '../../tests-utils/helpers/closeWelcomeModal';

test.describe('Search Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeDiscountModal(page);
  });

  test('shows location error when empty', async ({ page }) => {
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('location-error')).toHaveText('Location is required');
  });

  test('shows move in date error when empty', async ({ page }) => {
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('move-in-date-error')).toHaveText('Move in date is required');
  });

  test('shows no errors when form is valid', async ({ page }) => {
    await page.getByTestId('location-select').selectOption('KWASU Malete');
    await page.getByTestId('move-in-date').fill('2024-01-01');
    await page.getByTestId('occupants-select').selectOption('2');
    await page.getByTestId('search-button').click();
    
    await expect(page.getByTestId('location-error')).not.toBeVisible();
    await expect(page.getByTestId('move-in-date-error')).not.toBeVisible();
    await expect(page.getByTestId('occupants-error')).not.toBeVisible();
  });
});
