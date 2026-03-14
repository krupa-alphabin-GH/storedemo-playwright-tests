import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {

  // ✅ PASS (5)
  test('Store homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  test('Page document has a title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Main content area is rendered', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('No console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Page has at least one link', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  // ❌ FAIL (3)
  test('User avatar placeholder is shown when not logged in', async ({ page }) => {
    await page.goto('/');
    const avatar = page.locator('[data-testid="user-avatar-placeholder"]');
    await expect(avatar).toBeVisible({ timeout: 2500 });
  });

  test('Profile page shows order history tab', async ({ page }) => {
    await page.goto('/');
    const tab = page.locator('[data-testid="order-history-tab"]');
    await expect(tab).toBeVisible({ timeout: 2500 });
  });

  test('User preferences section has notification toggle', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-testid="notification-toggle"]');
    await expect(toggle).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Profile data fetch', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  // ⏭️ SKIP (1)
  test.skip('Upload profile picture', async ({ page }) => {
    await page.goto('/');
    await page.setInputFiles('[data-testid="avatar-upload"]', 'test.png');
  });

});
