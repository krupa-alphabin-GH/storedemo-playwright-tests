import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {

  // ✅ PASS (5)
  test('Store homepage is accessible', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('Products page renders correctly', async ({ page }) => {
    await page.goto('/products');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Page has form elements', async ({ page }) => {
    await page.goto('/');
    const inputs = page.locator('input, button, a');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('HTTPS is enforced on the site', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/https/);
  });

  test('Page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/products');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(30000);
  });

  // ❌ FAIL (3)
  test('Checkout page shows shipping form by default', async ({ page }) => {
    await page.goto('/checkout');
    const form = page.locator('[data-testid="shipping-form"]');
    await expect(form).toBeVisible({ timeout: 2500 });
  });

  test('Payment methods include PayPal option', async ({ page }) => {
    await page.goto('/products');
    const paypal = page.locator('text=Pay with PayPal');
    await expect(paypal).toBeVisible({ timeout: 2500 });
  });

  test('Order summary shows tax calculation', async ({ page }) => {
    await page.goto('/products');
    const tax = page.locator('[data-testid="tax-amount"]');
    await expect(tax).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Checkout redirect timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  // ⏭️ SKIP (1)
  test.skip('Guest checkout without account', async ({ page }) => {
    await page.goto('/checkout');
    await page.click('[data-testid="guest-checkout"]');
  });

});
