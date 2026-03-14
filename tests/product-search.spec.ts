import { test, expect } from '@playwright/test';

test.describe('Product Search', () => {

  // ✅ PASS (5)
  test('Search bar is visible on products page', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('Page loads without errors', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Products page URL is correct', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Page body is not empty after load', async ({ page }) => {
    await page.goto('/products');
    const content = await page.locator('body').textContent();
    expect(content?.length).toBeGreaterThan(0);
  });

  test('Page has images loaded', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  // ❌ FAIL (3)
  test('Search for xyz123 shows No results message', async ({ page }) => {
    await page.goto('/products');
    const noResults = page.locator('text=No results found for "xyz123"');
    await expect(noResults).toBeVisible({ timeout: 2500 });
  });

  test('Search suggestions dropdown appears on typing', async ({ page }) => {
    await page.goto('/products');
    const dropdown = page.locator('[data-testid="search-suggestions"]');
    await expect(dropdown).toBeVisible({ timeout: 2500 });
  });

  test('Voice search button is present', async ({ page }) => {
    await page.goto('/products');
    const voiceBtn = page.locator('[aria-label="Voice search"]');
    await expect(voiceBtn).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Search results load time', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    await expect(page).not.toHaveURL('about:blank');
  });

  // ⏭️ SKIP (1)
  test.skip('Search history shows recent searches', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="search-history"]');
  });

});
