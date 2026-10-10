import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Product discovery', () => {
  test('home page presents the product catalog @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.productCards.first()).toBeVisible();
    await expect(home.productCards).not.toHaveCount(0);
  });

  test('search narrows products by name @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.search('hammer');
    await expect(home.productCards.first()).toContainText(/hammer/i);
    const names = await home.productCards.allTextContents();
    expect(names.every(name => name.toLowerCase().includes('hammer'))).toBeTruthy();
  });

  test('no-results search communicates empty state', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.search('zz-no-product-918273');
    await expect(page.getByText(/no products found/i)).toBeVisible();
  });

  test('sort control orders products by price', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.sortSelect.selectOption('price,asc');
    await expect(home.productCards.first()).toBeVisible();
    await expect.poll(async () => {
      const prices = (await page.locator('[data-test="product-price"]').allTextContents())
        .map(text => Number(text.replace(/[^0-9.]/g, '')));
      return prices.every((price, index) => index === 0 || prices[index - 1] <= price);
    }).toBeTruthy();
  });

  test('category filter updates visible catalog', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const handTools = page.getByRole('checkbox', { name: 'Hand Tools', exact: true });
    await handTools.check();
    await expect(home.productCards.first()).toBeVisible();
    await expect(handTools).toBeChecked();
  });

  test('product card opens its detail page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const name = (await home.productCards.first().textContent())!.trim();
    await home.productCards.first().click();
    await expect(page.locator('[data-test="product-name"]')).toHaveText(name);
    await expect(page.locator('[data-test="product-description"]')).not.toBeEmpty();
  });
});
