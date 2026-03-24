import { test, expect } from '@playwright/test';

const API_BASE = 'https://dummyjson.com';

test.describe('API Products', () => {

  // ✅ PASS (25)
  test('GET /products full response structure validation', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip');
    expect(body).toHaveProperty('limit');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThan(0);
    expect(typeof body.skip).toBe('number');
    expect(typeof body.limit).toBe('number');
    const firstProduct = body.products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('description');
    expect(firstProduct).toHaveProperty('category');
    expect(firstProduct).toHaveProperty('thumbnail');
    expect(firstProduct).toHaveProperty('images');
    expect(typeof firstProduct.id).toBe('number');
    expect(typeof firstProduct.title).toBe('string');
    expect(typeof firstProduct.price).toBe('number');
    expect(firstProduct.price).toBeGreaterThan(0);
    expect(typeof firstProduct.description).toBe('string');
    expect(Array.isArray(firstProduct.images)).toBe(true);
  });

  test('GET /products iterate and validate first 10 products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?limit=10`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.products.length).toBe(10);
    for (const product of body.products) {
      expect(product).toHaveProperty('id');
      expect(typeof product.id).toBe('number');
      expect(product).toHaveProperty('title');
      expect(typeof product.title).toBe('string');
      expect(product.title.length).toBeGreaterThan(0);
      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
      expect(product).toHaveProperty('description');
      expect(typeof product.description).toBe('string');
      expect(product).toHaveProperty('category');
      expect(typeof product.category).toBe('string');
      expect(product).toHaveProperty('rating');
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(product).toHaveProperty('stock');
      expect(typeof product.stock).toBe('number');
      expect(product).toHaveProperty('thumbnail');
      expect(typeof product.thumbnail).toBe('string');
      expect(product).toHaveProperty('images');
      expect(Array.isArray(product.images)).toBe(true);
    }
  });

  test('GET /products individual product deep validation for products 1-10', async ({ request }) => {
    for (let id = 1; id <= 10; id++) {
      const response = await request.get(`${API_BASE}/products/${id}`);
      expect(response.status()).toBe(200);
      const product = await response.json();
      expect(product).toHaveProperty('id', id);
      expect(product).toHaveProperty('title');
      expect(typeof product.title).toBe('string');
      expect(product.title.length).toBeGreaterThan(0);
      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('rating');
      expect(product).toHaveProperty('stock');
      expect(product).toHaveProperty('thumbnail');
      expect(product).toHaveProperty('images');
    }
  });

  test('GET /products pagination full test with skip and limit', async ({ request }) => {
    const limits = [1, 3, 5, 10, 15, 20];
    for (const limit of limits) {
      const response = await request.get(`${API_BASE}/products?limit=${limit}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.products.length).toBeLessThanOrEqual(limit);
      expect(body).toHaveProperty('limit', limit);
    }
    const skips = [0, 5, 10, 20, 50];
    for (const skip of skips) {
      const response = await request.get(`${API_BASE}/products?skip=${skip}&limit=5`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('skip', skip);
      expect(body.products.length).toBeLessThanOrEqual(5);
    }
  });

  test('GET /products/categories full validation', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/categories`);
    expect(response.status()).toBe(200);
    const categories = await response.json();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    for (const category of categories) {
      expect(category).toHaveProperty('slug');
      expect(category).toHaveProperty('name');
      expect(typeof category.slug).toBe('string');
      expect(typeof category.name).toBe('string');
      expect(category.slug.length).toBeGreaterThan(0);
      expect(category.name.length).toBeGreaterThan(0);
    }
  });

  test('GET /products/search with multiple queries', async ({ request }) => {
    const queries = ['phone', 'laptop', 'perfume', 'cream', 'oil'];
    for (const query of queries) {
      const response = await request.get(`${API_BASE}/products/search?q=${query}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('products');
      expect(Array.isArray(body.products)).toBe(true);
      expect(body).toHaveProperty('total');
      expect(typeof body.total).toBe('number');
    }
  });

  test('POST /products/add full validation', async ({ request }) => {
    const newProduct = { title: 'Test Product', price: 29.99, description: 'A test product', category: 'test' };
    const response = await request.post(`${API_BASE}/products/add`, { data: newProduct });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
    expect(body).toHaveProperty('title', 'Test Product');
    expect(body).toHaveProperty('price', 29.99);
    expect(body).toHaveProperty('description', 'A test product');
    expect(body).toHaveProperty('category', 'test');
  });

  test('PUT /products update multiple products', async ({ request }) => {
    for (let id = 1; id <= 5; id++) {
      const response = await request.put(`${API_BASE}/products/${id}`, {
        data: { title: `Updated Product ${id}` },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('id', id);
      expect(body).toHaveProperty('title', `Updated Product ${id}`);
    }
  });

  test('DELETE /products delete multiple products', async ({ request }) => {
    for (let id = 1; id <= 5; id++) {
      const response = await request.delete(`${API_BASE}/products/${id}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('id', id);
      expect(body).toHaveProperty('isDeleted', true);
      expect(body).toHaveProperty('deletedOn');
    }
  });

  test('GET /products cross-compare list vs individual', async ({ request }) => {
    const listResponse = await request.get(`${API_BASE}/products?limit=5`);
    const listBody = await listResponse.json();
    expect(listBody.products.length).toBe(5);
    for (const product of listBody.products) {
      const individualResponse = await request.get(`${API_BASE}/products/${product.id}`);
      expect(individualResponse.status()).toBe(200);
      const individual = await individualResponse.json();
      expect(individual.id).toBe(product.id);
      expect(individual.title).toBe(product.title);
      expect(individual.price).toBe(product.price);
    }
  });

  test('GET /products response time validation across endpoints', async ({ request }) => {
    const endpoints = [
      `${API_BASE}/products`,
      `${API_BASE}/products/1`,
      `${API_BASE}/products/categories`,
      `${API_BASE}/products/search?q=phone`,
      `${API_BASE}/products?limit=5`,
      `${API_BASE}/products?limit=10&skip=5`,
    ];
    for (const endpoint of endpoints) {
      const start = Date.now();
      const response = await request.get(endpoint);
      const elapsed = Date.now() - start;
      expect(response.status()).toBe(200);
      expect(elapsed).toBeLessThan(10000);
      const body = await response.json();
      expect(body).toBeTruthy();
    }
  });

  test('GET /products verify product data types consistency', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?limit=15`);
    const body = await response.json();
    for (const product of body.products) {
      expect(typeof product.id).toBe('number');
      expect(typeof product.title).toBe('string');
      expect(typeof product.description).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(typeof product.rating).toBe('number');
      expect(typeof product.stock).toBe('number');
      expect(typeof product.category).toBe('string');
      expect(typeof product.thumbnail).toBe('string');
      expect(Array.isArray(product.images)).toBe(true);
      expect(product.id).toBeGreaterThan(0);
      expect(product.price).toBeGreaterThan(0);
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
    }
  });

  test('POST /products/add with various product data', async ({ request }) => {
    const products = [
      { title: 'Widget A', price: 9.99 },
      { title: 'Widget B', price: 19.99, description: 'B widget' },
      { title: 'Widget C', price: 29.99, category: 'widgets' },
      { title: 'Widget D', price: 39.99, description: 'D widget', category: 'premium' },
    ];
    for (const product of products) {
      const response = await request.post(`${API_BASE}/products/add`, { data: product });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('title', product.title);
      expect(body).toHaveProperty('price', product.price);
    }
  });

  test('GET /products verify image URLs in products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?limit=10`);
    const body = await response.json();
    for (const product of body.products) {
      expect(product).toHaveProperty('thumbnail');
      expect(typeof product.thumbnail).toBe('string');
      expect(product.thumbnail.length).toBeGreaterThan(0);
      expect(product).toHaveProperty('images');
      expect(Array.isArray(product.images)).toBe(true);
      for (const imgUrl of product.images) {
        expect(typeof imgUrl).toBe('string');
        expect(imgUrl.length).toBeGreaterThan(0);
      }
    }
  });

  test('GET /products sequential category fetch and validation', async ({ request }) => {
    const catResponse = await request.get(`${API_BASE}/products/categories`);
    const categories = await catResponse.json();
    expect(categories.length).toBeGreaterThan(0);
    const firstFive = categories.slice(0, 5);
    for (const cat of firstFive) {
      const prodResponse = await request.get(`${API_BASE}/products/category/${cat.slug}`);
      expect(prodResponse.status()).toBe(200);
      const prodBody = await prodResponse.json();
      expect(prodBody).toHaveProperty('products');
      expect(Array.isArray(prodBody.products)).toBe(true);
    }
  });

  // ❌ FAIL (7)
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
      data: { title: 'Test', price: 9.99 },
    });
    expect(response.status()).toBe(201);
  });

  test('GET /products/1 should have manufacturer field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('manufacturer', 'Apple Inc.');
  });

  test('GET /products/1 should have weight field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('weight_kg', 0.5);
  });

  test('GET /products/1 should have shipping info', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('shippingInfo');
    expect(body.shippingInfo).toHaveProperty('freeShipping', true);
  });

  test('GET /products should support sort by price', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?sortBy=price&order=asc`);
    const body = await response.json();
    expect(body.products[0].price).toBeLessThan(body.products[1].price);
  });

  // 🔄 FLAKY (3)
  test('Flaky - Product search API response', async ({ request }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    const response = await request.get(`${API_BASE}/products/search?q=phone`);
    expect(response.status()).toBe(200);
  });

  test('Flaky - Product category API timing', async ({ request }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    const response = await request.get(`${API_BASE}/products/categories`);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('Flaky - Product pagination API response', async ({ request }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    const response = await request.get(`${API_BASE}/products?limit=5&skip=10`);
    expect(response.status()).toBe(200);
  });

  // ⏭️ SKIP (2)
  test.skip('Bulk update product prices', async ({ request }) => {
    const response = await request.put(`${API_BASE}/products/bulk-update`, {
      data: { ids: [1, 2], price: 19.99 },
    });
    expect(response.status()).toBe(200);
  });

  test.skip('Batch delete products', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/products/batch-delete`, {
      data: { ids: [1, 2, 3] },
    });
    expect(response.status()).toBe(200);
  });

});
