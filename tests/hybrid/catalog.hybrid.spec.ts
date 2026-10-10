import { test, expect } from '../../fixtures/test';
import type { ProductPage } from '../../utils/api-types';

test('UI product detail agrees with API source of truth @smoke', async ({ page, api }) => {
  const catalog = await (await api.get('/products', { params: { q: 'Combination Pliers' } })).json() as ProductPage;
  const product = catalog.data.find(item => item.name === 'Combination Pliers');
  expect(product).toBeDefined();
  await page.goto('/');
  await page.getByPlaceholder(/search/i).fill(product!.name);
  await page.getByRole('button', { name: /search/i }).click();
  await page.locator('[data-test="product-name"]').filter({ hasText: product!.name }).click();
  await expect(page.locator('[data-test="product-name"]')).toHaveText(product!.name);
  const displayed = Number((await page.locator('[data-test="unit-price"]').textContent())!.replace(/[^0-9.]/g, ''));
  expect(displayed).toBe(product!.price);
});
