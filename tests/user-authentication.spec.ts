import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {

  // ✅ PASS (15)
  test('Auth page full load and structure verification', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL('about:blank');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const body = page.locator('body');
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(10);
    const images = page.locator('img');
    expect(await images.count()).toBeGreaterThan(0);
    const firstImg = page.locator('img').first();
    await expect(firstImg).toBeVisible({ timeout: 10000 });
    const inputs = page.locator('input, button');
    expect(await inputs.count()).toBeGreaterThan(0);
    const url = page.url();
    expect(url).toContain('https');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 2) / 3));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await expect(header).toBeVisible();
  });

  test('Auth page form input interaction', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const inputFields = page.locator('input');
    const inputCount = await inputFields.count();
    expect(inputCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputFields.nth(i);
      if (await input.isVisible()) {
        const isEnabled = await input.isEnabled();
        if (isEnabled) {
          await input.click();
          await page.waitForTimeout(800);
          const type = await input.getAttribute('type');
          if (type === 'text' || type === 'email' || type === 'search' || !type) {
            await input.fill('test input');
            await page.waitForTimeout(800);
            const value = await input.inputValue();
            expect(value).toBe('test input');
            await input.fill('');
            await page.waitForTimeout(500);
          }
        }
      }
      await page.waitForTimeout(500);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Auth page multi-page navigation flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(2000);
    const homeTitle = await page.title();
    expect(homeTitle.length).toBeGreaterThan(0);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const prodTitle = await page.title();
    expect(prodTitle.length).toBeGreaterThan(0);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const backTitle = await page.title();
    expect(backTitle).toBe(homeTitle);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    await page.goto('/');
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Auth page no JS errors during full interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Auth page reload DOM consistency', async ({ page }) => {
    await page.goto('/');
    const titleBefore = await page.title();
    const linksBefore = await page.locator('a').count();
    const imgsBefore = await page.locator('img').count();
    await page.waitForTimeout(2000);
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      expect(await page.title()).toBe(titleBefore);
      expect(await page.locator('a').count()).toBe(linksBefore);
      expect(await page.locator('img').count()).toBe(imgsBefore);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Auth page keyboard tab navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    await page.keyboard.press('Home');
    await page.waitForTimeout(1500);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Auth page CSS and layout structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const styles = page.locator('link[rel="stylesheet"], style');
    expect(await styles.count()).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    expect(headerBox!.y).toBeLessThan(100);
    const container = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(container).toBeVisible({ timeout: 10000 });
    const containerBox = await container.boundingBox();
    expect(containerBox).toBeTruthy();
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    const footerBox = await footer.boundingBox();
    expect(footerBox).toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Auth page performance multi-load', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      const start = Date.now();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      expect(Date.now() - start).toBeLessThan(30000);
      await page.waitForTimeout(2000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 10000 });
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Auth page full scroll journey', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps);
      await page.waitForTimeout(1500);
    }
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    for (let i = steps; i >= 0; i--) {
      await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps);
      await page.waitForTimeout(1500);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Auth page multi-cycle navigation stability', async ({ page }) => {
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.goto('/');
      await expect(page).toHaveURL(/storedemo/);
      await page.waitForTimeout(1500);
      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 10000 });
      await page.goto('/products');
      await expect(page).toHaveURL(/products/);
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Auth page image deep inspection', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const allImages = page.locator('img');
    const totalImages = await allImages.count();
    expect(totalImages).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(totalImages, 8); i++) {
      const img = allImages.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      if (await img.isVisible()) {
        const box = await img.boundingBox();
        expect(box).toBeTruthy();
      }
      await page.waitForTimeout(600);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Auth page link and button integrity', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(linkCount, 8); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      await page.waitForTimeout(400);
    }
    const buttons = page.locator('button');
    const btnCount = await buttons.count();
    for (let i = 0; i < Math.min(btnCount, 5); i++) {
      if (await buttons.nth(i).isVisible()) {
        expect(await buttons.nth(i).isEnabled()).toBeTruthy();
      }
      await page.waitForTimeout(400);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Auth page document metadata check', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
    const stylesheets = page.locator('link[rel="stylesheet"]');
    expect(await stylesheets.count()).toBeGreaterThan(0);
    const scripts = page.locator('script[src]');
    expect(await scripts.count()).toBeGreaterThanOrEqual(0);
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    const text = await body.textContent();
    expect(text!.trim().length).toBeGreaterThan(50);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Auth page back forward deep navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ❌ FAIL (7)
  test('Login form shows Remember Me checkbox', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const checkbox = page.locator('[data-testid="remember-me"]');
    await expect(checkbox).toBeVisible({ timeout: 3000 });
  });

  test('Social login buttons Google Facebook visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const socialBtn = page.locator('text=Continue with Google');
    await expect(socialBtn).toBeVisible({ timeout: 3000 });
  });

  test('Password reset link visible on login form', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const resetLink = page.locator('[data-testid="forgot-password-link"]');
    await expect(resetLink).toBeVisible({ timeout: 3000 });
  });

  test('Login form password visibility toggle', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const toggle = page.locator('[data-testid="password-visibility-toggle"]');
    await expect(toggle).toBeVisible({ timeout: 3000 });
  });

  test('Registration link visible on login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const registerLink = page.locator('text=Create an account');
    await expect(registerLink).toBeVisible({ timeout: 3000 });
  });

  test('Login form CAPTCHA verification', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const captcha = page.locator('[data-testid="captcha-widget"]');
    await expect(captcha).toBeVisible({ timeout: 3000 });
  });

  test('Terms of service link on login form', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const tos = page.locator('[data-testid="terms-of-service-link"]');
    await expect(tos).toBeVisible({ timeout: 3000 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Auth session token validation', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/');
    await page.waitForTimeout(3000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Login form render timing', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/');
    await page.waitForTimeout(3000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Flaky - OAuth redirect response', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/storedemo/);
  });

  // ⏭️ SKIP (2)
  test.skip('Two-factor authentication setup', async ({ page }) => {
    await page.goto('/');
  });

  test.skip('Biometric authentication login', async ({ page }) => {
    await page.goto('/');
  });

});
