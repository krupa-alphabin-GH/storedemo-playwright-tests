import { test, expect } from '@playwright/test';

const API_BASE = 'https://dummyjson.com';

test.describe('API Users', () => {

  // ✅ PASS (5)
  test('GET /users returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    expect(response.status()).toBe(200);
  });

  test('GET /users returns users array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
  });

  test('GET /users/1 returns user with id 1', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('firstName');
  });

  test('GET /users?limit=3 returns max 3 users', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=3`);
    const body = await response.json();
    expect(body.users.length).toBeLessThanOrEqual(3);
  });

  test('DELETE /users/1 returns isDeleted true', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted', true);
  });

  // ❌ FAIL (3)
  test('GET /users/1 should have role as superadmin', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('role', 'superadmin');
  });

  test('GET /users should return exactly 100 users by default', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    const body = await response.json();
    expect(body.users.length).toBe(100);
  });

  test('POST /users/add should return 201 status', async ({ request }) => {
    const response = await request.post(`${API_BASE}/users/add`, {
      data: { firstName: 'Test', lastName: 'User' },
    });
    expect(response.status()).toBe(201);
  });

  // 🔄 FLAKY (1)
  test('Flaky - User search API response', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/users/search?q=john`);
    expect(response.status()).toBe(200);
  });

  // ⏭️ SKIP (1)
  test.skip('Bulk delete users endpoint', async ({ request }) => {
    const response = await request.post(`${API_BASE}/users/bulk-delete`, {
      data: { ids: [1, 2, 3] },
    });
    expect(response.status()).toBe(200);
  });

});
