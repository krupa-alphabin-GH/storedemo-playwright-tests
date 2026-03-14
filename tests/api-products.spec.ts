import { test, expect } from '@playwright/test';

const API_BASE = 'https://dummyjson.com';

test.describe('API Products', () => {

  // ✅ PASS (5)
  test('GET /products returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    expect(response.status()).toBe(200);
  });

  test('GET /products returns products array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('GET /products/1 returns product with id 1', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
  });

  test('GET /products/categories returns array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/categories`);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /products?limit=5 returns max 5 products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?limit=5`);
    const body = await response.json();
    expect(body.products.length).toBeLessThanOrEqual(5);
  });

  // ❌ FAIL (3)
  test('GET /products/1 should have warranty field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('warranty', '2 years');
  });

  test('GET /products should return exactly 200 products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    const body = await response.json();
    expect(body.products.length).toBe(200);
  });

  test('POST /products/add should return 201 status', async ({ request }) => {
    const response = await request.post(`${API_BASE}/products/add`, {
      data: { title: 'Test Product', price: 9.99 },
    });
    expect(response.status()).toBe(201);
  });

  // 🔄 FLAKY (1)
  test('Flaky - Product search API response', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/products/search?q=phone`);
    expect(response.status()).toBe(200);
  });

  // ⏭️ SKIP (1)
  test.skip('Bulk update product prices', async ({ request }) => {
    const response = await request.put(`${API_BASE}/products/bulk-update`, {
      data: { ids: [1, 2], price: 19.99 },
    });
    expect(response.status()).toBe(200);
  });

});
