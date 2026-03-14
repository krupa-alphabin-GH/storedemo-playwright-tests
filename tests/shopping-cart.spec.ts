import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {

  // ✅ PASS (5)
  test('Cart icon is visible on page', async ({ page }) => {
    await page.goto('/products');
    const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
  });

  test('Store page loads without errors', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Page has interactive buttons', async ({ page }) => {
    await page.goto('/products');
    const btn = page.locator('button').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  test('Navigation works from products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Page has visible content', async ({ page }) => {
    await page.goto('/products');
    const content = await page.locator('body').textContent();
    expect(content!.trim().length).toBeGreaterThan(10);
  });

  // ❌ FAIL (3)
  test('Cart shows Your cart is empty message by default', async ({ page }) => {
    await page.goto('/products');
    const emptyMsg = page.locator('[data-testid="empty-cart-message"]');
    await expect(emptyMsg).toBeVisible({ timeout: 2500 });
  });

  test('Cart badge shows count of 3 items', async ({ page }) => {
    await page.goto('/products');
    const badge = page.locator('text=3 items in cart');
    await expect(badge).toBeVisible({ timeout: 2500 });
  });

  test('Cart total displays $0.00 when empty', async ({ page }) => {
    await page.goto('/products');
    const total = page.locator('[data-testid="cart-total-zero"]');
    await expect(total).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Add to cart button response', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const btn = page.locator('button').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (1)
  test.skip('Apply coupon code to cart', async ({ page }) => {
    await page.goto('/products');
    await page.fill('[data-testid="coupon-input"]', 'SAVE20');
  });

});
