import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

test.describe('Cart journey', () => {
  test('shopper adds an in-stock product to cart @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.openProduct('Combination Pliers');
    const product = new ProductPage(page);
    await product.add();
    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('1');
  });

  test('quantity affects the cart line subtotal', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.openProduct('Combination Pliers');
    const product = new ProductPage(page);
    const unitPrice = Number((await product.price.textContent())!.replace(/[^0-9.]/g, ''));
    await product.add(2);
    await page.locator('[data-test="nav-cart"]').click();
    const subtotal = Number((await page.locator('[data-test="line-price"]').textContent())!.replace(/[^0-9.]/g, ''));
    expect(subtotal).toBeCloseTo(unitPrice * 2, 2);
  });

  test('shopper removes a product from cart', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.openProduct('Combination Pliers');
    await new ProductPage(page).add();
    await page.locator('[data-test="nav-cart"]').click();
    await page.locator('tbody tr').first().locator('td').last().locator('button, a, [role="button"], svg').first().click();
    await expect(page.locator('tbody tr')).toHaveCount(0);
  });

  test('checkout requires authentication', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.openProduct('Combination Pliers');
    await new ProductPage(page).add();
    await page.locator('[data-test="nav-cart"]').click();
    await page.locator('[data-test="proceed-1"]').click();
    await expect(page.locator('[data-test="email"]')).toBeVisible();
    await expect(page.locator('[data-test="login-submit"]')).toBeVisible();
  });
});
