import { test, expect } from '@playwright/test';

test.describe('Product Listing', () => {

  // ✅ PASS (5)
  test('Products page loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Products page has content', async ({ page }) => {
    await page.goto('/products');
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('Products page returns 200', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Multiple product cards are displayed', async ({ page }) => {
    await page.goto('/products');
    const products = page.locator('[class*="product"], [class*="card"], [class*="item"]').first();
    await expect(products).toBeVisible({ timeout: 10000 });
  });

  test('Page has heading element', async ({ page }) => {
    await page.goto('/products');
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  // ❌ FAIL (3)
  test('Products page should show pagination with 20 pages', async ({ page }) => {
    await page.goto('/products');
    const pagination = page.locator('text=Page 20');
    await expect(pagination).toBeVisible({ timeout: 2500 });
  });

  test('Verify Out of Stock badge on first product', async ({ page }) => {
    await page.goto('/products');
    const badge = page.locator('[data-testid="out-of-stock-badge"]').first();
    await expect(badge).toBeVisible({ timeout: 2500 });
  });

  test('Products sorted by price descending by default', async ({ page }) => {
    await page.goto('/products');
    const sortLabel = page.locator('text=Price: High to Low');
    await expect(sortLabel).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Product count validation', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  // ⏭️ SKIP (1)
  test.skip('Infinite scroll loads more products', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

});
