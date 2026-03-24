import { test, expect } from '@playwright/test';

const API_BASE = 'https://dummyjson.com';

test.describe('API Users', () => {

  // ✅ PASS (25)
  test('GET /users full response structure validation', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip');
    expect(body).toHaveProperty('limit');
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThan(0);
    expect(typeof body.skip).toBe('number');
    expect(typeof body.limit).toBe('number');
    const firstUser = body.users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('phone');
    expect(firstUser).toHaveProperty('username');
    expect(firstUser).toHaveProperty('age');
    expect(firstUser).toHaveProperty('gender');
    expect(firstUser).toHaveProperty('image');
    expect(typeof firstUser.id).toBe('number');
    expect(typeof firstUser.firstName).toBe('string');
    expect(typeof firstUser.lastName).toBe('string');
    expect(typeof firstUser.email).toBe('string');
    expect(firstUser.email).toContain('@');
  });

  test('GET /users iterate and validate first 10 users', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=10`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.users.length).toBe(10);
    for (const user of body.users) {
      expect(user).toHaveProperty('id');
      expect(typeof user.id).toBe('number');
      expect(user).toHaveProperty('firstName');
      expect(typeof user.firstName).toBe('string');
      expect(user.firstName.length).toBeGreaterThan(0);
      expect(user).toHaveProperty('lastName');
      expect(typeof user.lastName).toBe('string');
      expect(user).toHaveProperty('email');
      expect(typeof user.email).toBe('string');
      expect(user.email).toContain('@');
      expect(user).toHaveProperty('age');
      expect(typeof user.age).toBe('number');
      expect(user.age).toBeGreaterThan(0);
      expect(user).toHaveProperty('gender');
      expect(typeof user.gender).toBe('string');
      expect(user).toHaveProperty('phone');
      expect(typeof user.phone).toBe('string');
      expect(user).toHaveProperty('username');
      expect(typeof user.username).toBe('string');
      expect(user).toHaveProperty('image');
      expect(typeof user.image).toBe('string');
    }
  });

  test('GET /users individual user deep validation for users 1-10', async ({ request }) => {
    for (let id = 1; id <= 10; id++) {
      const response = await request.get(`${API_BASE}/users/${id}`);
      expect(response.status()).toBe(200);
      const user = await response.json();
      expect(user).toHaveProperty('id', id);
      expect(user).toHaveProperty('firstName');
      expect(typeof user.firstName).toBe('string');
      expect(user.firstName.length).toBeGreaterThan(0);
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('email');
      expect(user.email).toContain('@');
      expect(user).toHaveProperty('age');
      expect(user.age).toBeGreaterThan(0);
      expect(user).toHaveProperty('gender');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('image');
      expect(user).toHaveProperty('address');
      expect(typeof user.address).toBe('object');
    }
  });

  test('GET /users pagination full test with skip and limit', async ({ request }) => {
    const limits = [1, 3, 5, 10, 15, 20];
    for (const limit of limits) {
      const response = await request.get(`${API_BASE}/users?limit=${limit}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.users.length).toBeLessThanOrEqual(limit);
      expect(body).toHaveProperty('limit', limit);
    }
    const skips = [0, 5, 10, 20, 50];
    for (const skip of skips) {
      const response = await request.get(`${API_BASE}/users?skip=${skip}&limit=5`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('skip', skip);
      expect(body.users.length).toBeLessThanOrEqual(5);
    }
  });

  test('GET /users/search with multiple queries', async ({ request }) => {
    const queries = ['john', 'emily', 'michael', 'james', 'sarah'];
    for (const query of queries) {
      const response = await request.get(`${API_BASE}/users/search?q=${query}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('users');
      expect(Array.isArray(body.users)).toBe(true);
      expect(body).toHaveProperty('total');
      expect(typeof body.total).toBe('number');
    }
  });

  test('POST /users/add full validation', async ({ request }) => {
    const newUser = { firstName: 'Test', lastName: 'User', email: 'test@example.com', age: 25 };
    const response = await request.post(`${API_BASE}/users/add`, { data: newUser });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
    expect(body).toHaveProperty('firstName', 'Test');
    expect(body).toHaveProperty('lastName', 'User');
    expect(body).toHaveProperty('email', 'test@example.com');
    expect(body).toHaveProperty('age', 25);
  });

  test('PUT /users update multiple users', async ({ request }) => {
    for (let id = 1; id <= 5; id++) {
      const response = await request.put(`${API_BASE}/users/${id}`, {
        data: { firstName: `Updated_${id}` },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('id', id);
      expect(body).toHaveProperty('firstName', `Updated_${id}`);
    }
  });

  test('DELETE /users delete multiple users', async ({ request }) => {
    for (let id = 1; id <= 5; id++) {
      const response = await request.delete(`${API_BASE}/users/${id}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('id', id);
      expect(body).toHaveProperty('isDeleted', true);
      expect(body).toHaveProperty('deletedOn');
    }
  });

  test('GET /users cross-compare list vs individual', async ({ request }) => {
    const listResponse = await request.get(`${API_BASE}/users?limit=5`);
    const listBody = await listResponse.json();
    expect(listBody.users.length).toBe(5);
    for (const user of listBody.users) {
      const individualResponse = await request.get(`${API_BASE}/users/${user.id}`);
      expect(individualResponse.status()).toBe(200);
      const individual = await individualResponse.json();
      expect(individual.id).toBe(user.id);
      expect(individual.firstName).toBe(user.firstName);
      expect(individual.lastName).toBe(user.lastName);
      expect(individual.email).toBe(user.email);
    }
  });

  test('POST /auth/login full token validation', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'emilys', password: 'emilyspass' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('refreshToken');
    expect(typeof body.refreshToken).toBe('string');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('username');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('lastName');
    expect(body).toHaveProperty('image');
  });

  test('GET /users response time validation across endpoints', async ({ request }) => {
    const endpoints = [
      `${API_BASE}/users`,
      `${API_BASE}/users/1`,
      `${API_BASE}/users/search?q=john`,
      `${API_BASE}/users?limit=5`,
      `${API_BASE}/users?limit=10&skip=5`,
      `${API_BASE}/users?limit=1`,
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

  test('GET /users verify user data types consistency', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=15`);
    const body = await response.json();
    for (const user of body.users) {
      expect(typeof user.id).toBe('number');
      expect(typeof user.firstName).toBe('string');
      expect(typeof user.lastName).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.age).toBe('number');
      expect(typeof user.gender).toBe('string');
      expect(typeof user.phone).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.image).toBe('string');
      expect(user.id).toBeGreaterThan(0);
      expect(user.age).toBeGreaterThan(0);
      expect(user.email).toContain('@');
    }
  });

  test('POST /users/add with various user data', async ({ request }) => {
    const users = [
      { firstName: 'Alice', lastName: 'Smith' },
      { firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com' },
      { firstName: 'Charlie', lastName: 'Brown', age: 30 },
      { firstName: 'Diana', lastName: 'Prince', email: 'diana@test.com', age: 28 },
    ];
    for (const user of users) {
      const response = await request.post(`${API_BASE}/users/add`, { data: user });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('firstName', user.firstName);
      expect(body).toHaveProperty('lastName', user.lastName);
    }
  });

  test('GET /users verify address structure', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=5`);
    const body = await response.json();
    for (const user of body.users) {
      expect(user).toHaveProperty('address');
      expect(typeof user.address).toBe('object');
      expect(user.address).toHaveProperty('address');
      expect(user.address).toHaveProperty('city');
      expect(user.address).toHaveProperty('state');
      expect(user.address).toHaveProperty('postalCode');
      expect(typeof user.address.city).toBe('string');
      expect(typeof user.address.state).toBe('string');
    }
  });

  test('GET /users verify user company data', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=5`);
    const body = await response.json();
    for (const user of body.users) {
      expect(user).toHaveProperty('company');
      expect(typeof user.company).toBe('object');
      expect(user.company).toHaveProperty('name');
      expect(user.company).toHaveProperty('department');
      expect(user.company).toHaveProperty('title');
      expect(typeof user.company.name).toBe('string');
      expect(typeof user.company.department).toBe('string');
      expect(typeof user.company.title).toBe('string');
    }
  });

  // ❌ FAIL (7)
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

  test('GET /users/1 should have department field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('department', 'Engineering');
  });

  test('GET /users/1 should have salary field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('salary');
    expect(body.salary).toBeGreaterThan(50000);
  });

  test('GET /users/1 should have permissions array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('permissions');
    expect(Array.isArray(body.permissions)).toBe(true);
    expect(body.permissions).toContain('admin');
  });

  test('GET /users should support sort by name', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?sortBy=firstName&order=asc`);
    const body = await response.json();
    const first = body.users[0].firstName;
    const second = body.users[1].firstName;
    expect(first.localeCompare(second)).toBeLessThanOrEqual(0);
  });

  // 🔄 FLAKY (3)
  test('Flaky - User search API response', async ({ request }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    const response = await request.get(`${API_BASE}/users/search?q=john`);
    expect(response.status()).toBe(200);
  });

  test('Flaky - User auth token refresh', async ({ request }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    const response = await request.get(`${API_BASE}/users/1`);
    expect(response.status()).toBe(200);
  });

  test('Flaky - User pagination API response', async ({ request }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    const response = await request.get(`${API_BASE}/users?limit=5&skip=10`);
    expect(response.status()).toBe(200);
  });

  // ⏭️ SKIP (2)
  test.skip('Bulk delete users endpoint', async ({ request }) => {
    const response = await request.post(`${API_BASE}/users/bulk-delete`, {
      data: { ids: [1, 2, 3] },
    });
    expect(response.status()).toBe(200);
  });

  test.skip('Batch update user roles', async ({ request }) => {
    const response = await request.put(`${API_BASE}/users/batch-update`, {
      data: { ids: [1, 2], role: 'admin' },
    });
    expect(response.status()).toBe(200);
  });

});
