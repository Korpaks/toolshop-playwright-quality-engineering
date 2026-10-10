import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('mobile shopper can browse and open a product @smoke', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await expect(home.productCards.first()).toBeVisible();
  await home.productCards.first().click();
  await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
});

test('mobile layout does not overflow horizontally', async ({ page }) => {
  await new HomePage(page).goto();
  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
});
