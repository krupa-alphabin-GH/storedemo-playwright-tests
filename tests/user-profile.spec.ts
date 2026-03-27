import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {

  // ✅ PASS (15)
  test('Profile page full load and content verification', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(10);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const images = page.locator('img');
    expect(await images.count()).toBeGreaterThan(0);
    const firstImg = page.locator('img').first();
    await expect(firstImg).toBeVisible({ timeout: 10000 });
    const src = await firstImg.getAttribute('src');
    expect(src).toBeTruthy();
    const buttons = page.locator('button, [role="button"]');
    expect(await buttons.count()).toBeGreaterThan(0);
    const container = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(container).toBeVisible({ timeout: 10000 });
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

  test('Profile page multi-page navigation flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(2000);
    const homeTitle = await page.title();
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const detailBody = page.locator('body');
    await expect(detailBody).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const backTitle = await page.title();
    expect(backTitle).toBe(homeTitle);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Profile page no JS errors during interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 2) / 3));
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
  });

  test('Profile page reload stability', async ({ page }) => {
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

  test('Profile page keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    await page.keyboard.press('End');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Home');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Profile page CSS and visual layout', async ({ page }) => {
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

  test('Profile page full scroll journey', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps);
      await page.waitForTimeout(1500);
      const body = page.locator('body');
      await expect(body).toBeVisible();
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

  test('Profile page performance multi-load', async ({ page }) => {
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

  test('Profile page image deep inspection', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const allImages = page.locator('img');
    const totalImages = await allImages.count();
    expect(totalImages).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(totalImages, 8); i++) {
      const img = allImages.nth(i);
      const imgSrc = await img.getAttribute('src');
      expect(imgSrc).toBeTruthy();
      if (await img.isVisible()) {
        const box = await img.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeGreaterThan(0);
      }
      await page.waitForTimeout(600);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Profile page link and button integrity', async ({ page }) => {
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

  test('Profile page multi-cycle navigation stability', async ({ page }) => {
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

  test('Profile page document metadata', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const url = page.url();
    expect(url).toContain('https');
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
    const stylesheets = page.locator('link[rel="stylesheet"]');
    expect(await stylesheets.count()).toBeGreaterThan(0);
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

  test('Profile page back forward navigation', async ({ page }) => {
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

  test('Profile page form inputs interaction', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const isEnabled = await input.isEnabled();
        if (isEnabled) {
          await input.click();
          await page.waitForTimeout(800);
          const type = await input.getAttribute('type');
          if (type === 'text' || type === 'email' || type === 'search' || !type) {
            await input.fill('profile test');
            await page.waitForTimeout(800);
            expect(await input.inputValue()).toBe('profile test');
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
  });

  // ❌ FAIL (5)
  test('User avatar placeholder shown when not logged in', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const avatar = page.locator('[data-testid="user-avatar-placeholder"]');
    await expect(avatar).toBeVisible({ timeout: 3000 });
  });

  test('Profile page shows edit profile button', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const editBtn = page.locator('[data-testid="edit-profile-btn"]');
    await expect(editBtn).toBeVisible({ timeout: 3000 });
  });

  test('Profile displays order history tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const orderTab = page.locator('text=Order History');
    await expect(orderTab).toBeVisible({ timeout: 3000 });
  });

  test('Profile shows saved addresses section', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const addresses = page.locator('[data-testid="saved-addresses"]');
    await expect(addresses).toBeVisible({ timeout: 3000 });
  });

  test('Profile displays notification preferences', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const notifications = page.locator('[data-testid="notification-preferences"]');
    await expect(notifications).toBeVisible({ timeout: 3000 });
  });

  
  test('Flaky - Profile data fetch', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/');
    await page.waitForTimeout(3000);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Flaky - Profile image load timing', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/');
    await page.waitForTimeout(3000);
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Profile session persistence', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/storedemo/);
  });


  // test.skip('Upload profile picture', async ({ page }) => {
  //   await page.goto('/');
  // });

  // test.skip('Delete user account', async ({ page }) => {
  //   await page.goto('/');
  // });

});
