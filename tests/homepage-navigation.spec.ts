import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation', () => {

  // ✅ PASS (5)
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  test('Page title is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL('about:blank');
  });

  test('Navigation bar is present', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('Footer is visible on homepage', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Homepage has product section', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ❌ FAIL (3)
  test('Homepage should have login modal open by default', async ({ page }) => {
    await page.goto('/');
    const modal = page.locator('[data-testid="login-modal"]');
    await expect(modal).toBeVisible({ timeout: 2500 });
  });

  test('Verify promo banner displays discount code', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('text=DISCOUNT50');
    await expect(banner).toBeVisible({ timeout: 2500 });
  });

  test('Homepage should have exactly 50 products', async ({ page }) => {
    await page.goto('/');
    const products = page.locator('.product-card');
    await expect(products).toHaveCount(50, { timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Homepage load time check', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await expect(page).not.toHaveURL('about:blank');
  });

  // ⏭️ SKIP (1)
  test.skip('Dark mode toggle on homepage', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="dark-mode-toggle"]');
  });

});
