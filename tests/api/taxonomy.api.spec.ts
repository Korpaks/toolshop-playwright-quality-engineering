import { test, expect } from '../../fixtures/test';

test.describe('Catalog taxonomy API', () => {
  test('GET brands returns named identifiers @smoke', async ({ api }) => {
    const response = await api.get('/brands');
    expect(response.status()).toBe(200);
    const brands = await response.json() as Array<{ id: string; name: string }>;
    expect(brands.length).toBeGreaterThan(1);
    expect(brands.every(brand => brand.id && brand.name)).toBeTruthy();
  });

  test('GET categories returns a hierarchy', async ({ api }) => {
    const response = await api.get('/categories/tree');
    expect(response.status()).toBe(200);
    const categories = await response.json() as Array<{ id: string; name: string; sub_categories?: unknown[] }>;
    expect(categories.length).toBeGreaterThan(1);
    expect(categories.some(category => Array.isArray(category.sub_categories))).toBeTruthy();
  });

  test('product images use supported web formats', async ({ api }) => {
    const body = await (await api.get('/products?page=1')).json() as { data: Array<{ product_image: { file_name: string } }> };
    for (const item of body.data) expect(item.product_image.file_name).toMatch(/\.(avif|webp|png|jpe?g)$/i);
  });

  test('API responds with JSON content type', async ({ api }) => {
    const response = await api.get('/brands');
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('invalid route returns a client error', async ({ api }) => {
    const response = await api.get('/definitely-not-an-endpoint');
    expect(response.status()).toBe(404);
  });
});
