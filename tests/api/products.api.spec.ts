import { test, expect } from '../../fixtures/test';
import type { Product, ProductPage } from '../../utils/api-types';

test.describe('Product catalog API', () => {
  test('GET products returns a paginated catalog @smoke', async ({ api }) => {
    const response = await api.get('/products?page=1');
    expect(response.status()).toBe(200);
    const body = await response.json() as ProductPage;
    expect(body.current_page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThan(body.data.length);
  });

  test('product objects satisfy the core contract', async ({ api }) => {
    const body = await (await api.get('/products?page=1')).json() as ProductPage;
    for (const product of body.data) {
      expect(product.id).toMatch(/^[0-9A-Z]{26}$/);
      expect(product.name).not.toEqual('');
      expect(product.price).toBeGreaterThan(0);
      expect(typeof product.in_stock).toBe('boolean');
      expect(product.category.name).not.toEqual('');
      expect(product.brand.name).not.toEqual('');
    }
  });

  test('pagination returns distinct pages', async ({ api }) => {
    const first = await (await api.get('/products?page=1')).json() as ProductPage;
    const second = await (await api.get('/products?page=2')).json() as ProductPage;
    expect(second.current_page).toBe(2);
    expect(second.data[0].id).not.toBe(first.data[0].id);
  });

  test('search finds matching products', async ({ api }) => {
    const body = await (await api.get('/products', { params: { 'q': 'hammer' } })).json() as ProductPage;
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.every(product => product.name.toLowerCase().includes('hammer'))).toBeTruthy();
  });

  test('search for impossible term returns an empty result', async ({ api }) => {
    const response = await api.get('/products', { params: { q: 'zz-no-product-918273' } });
    expect(response.status()).toBe(200);
    const body = await response.json() as ProductPage;
    expect(body.data).toEqual([]);
    expect(body.total).toBe(0);
  });

  test('sort by price ascending is honored', async ({ api }) => {
    const body = await (await api.get('/products', { params: { sort: 'price,asc' } })).json() as ProductPage;
    const prices = body.data.map(item => item.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price descending is honored', async ({ api }) => {
    const body = await (await api.get('/products', { params: { sort: 'price,desc' } })).json() as ProductPage;
    const prices = body.data.map(item => item.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('single product endpoint matches catalog data', async ({ api }) => {
    const catalog = await (await api.get('/products?page=1')).json() as ProductPage;
    const chosen = catalog.data[0];
    const response = await api.get(`/products/${chosen.id}`);
    expect(response.status()).toBe(200);
    const product = await response.json() as Product;
    expect(product).toMatchObject({ id: chosen.id, name: chosen.name, price: chosen.price });
  });

  test('unknown product returns not found without mutating data', async ({ api }) => {
    const response = await api.get('/products/01AAAAAAAAAAAAAAAAAAAAAAAA');
    expect(response.status()).toBe(404);
  });

  test('unsupported method is rejected safely', async ({ api }) => {
    const response = await api.delete('/products');
    expect([401, 403, 405]).toContain(response.status());
  });
});
