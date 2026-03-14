import { test, expect } from '@playwright/test';

test.describe('Product Details', () => {

  // ✅ PASS (5)
  test('Product detail page loads', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page has clickable elements', async ({ page }) => {
    await page.goto('/products');
    const links = page.locator('a').first();
    await expect(links).toBeVisible({ timeout: 10000 });
  });

  test('Product images are present', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Page renders without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Product page has text content', async ({ page }) => {
    await page.goto('/products');
    const text = await page.locator('body').textContent();
    expect(text).toBeTruthy();
  });

  // ❌ FAIL (3)
  test('Product detail shows 360-degree view button', async ({ page }) => {
    await page.goto('/products');
    const btn = page.locator('[data-testid="360-view"]');
    await expect(btn).toBeVisible({ timeout: 2500 });
  });

  test('Product detail has size selector', async ({ page }) => {
    await page.goto('/products');
    const selector = page.locator('[data-testid="size-selector"]');
    await expect(selector).toBeVisible({ timeout: 2500 });
  });

  test('Product availability shows In Stock 150 units', async ({ page }) => {
    await page.goto('/products');
    const stock = page.locator('text=In Stock: 150 units');
    await expect(stock).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Product image gallery loads', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (1)
  test.skip('Product comparison feature', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="compare-btn"]');
  });

});
