import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {

  // ✅ PASS (5)
  test('Login page is accessible', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL('about:blank');
  });

  test('Page has user profile icon area', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Page accepts keyboard input', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input').first();
    if (await input.isVisible()) {
      await expect(input).toBeEnabled();
    } else {
      expect(true).toBe(true);
    }
  });

  test('Site uses secure connection', async ({ page }) => {
    await page.goto('/');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Header is present on page', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  // ❌ FAIL (3)
  test('Login form shows Remember Me checkbox', async ({ page }) => {
    await page.goto('/');
    const checkbox = page.locator('[data-testid="remember-me"]');
    await expect(checkbox).toBeVisible({ timeout: 2500 });
  });

  test('Social login buttons Google Facebook are visible', async ({ page }) => {
    await page.goto('/');
    const socialBtn = page.locator('text=Continue with Google');
    await expect(socialBtn).toBeVisible({ timeout: 2500 });
  });

  test('Password reset link is visible on login form', async ({ page }) => {
    await page.goto('/');
    const resetLink = page.locator('[data-testid="forgot-password-link"]');
    await expect(resetLink).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (1)
  test('Flaky - Auth session token validation', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (1)
  test.skip('Two-factor authentication setup', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="2fa-setup"]');
  });

});
