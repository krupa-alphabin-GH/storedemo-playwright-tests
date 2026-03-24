import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {

  // ✅ PASS (15)
  test('Checkout flow full page load and structure verification', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(10);
    const images = page.locator('img');
    expect(await images.count()).toBeGreaterThan(0);
    const buttons = page.locator('button, a, input');
    expect(await buttons.count()).toBeGreaterThan(0);
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
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Checkout flow complete navigation: home > products > detail > back', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(2000);
    const homeHeader = page.locator('header').first();
    await expect(homeHeader).toBeVisible({ timeout: 10000 });
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const prodHeader = page.locator('header').first();
    await expect(prodHeader).toBeVisible({ timeout: 10000 });
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const detailBody = page.locator('body');
    await expect(detailBody).toBeVisible();
    const detailText = await detailBody.textContent();
    expect(detailText!.trim().length).toBeGreaterThan(10);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const finalBody = page.locator('body');
    await expect(finalBody).toBeVisible();
  });

  test('Checkout flow products page deep content check', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    const cards = page.locator('[class*="product"], [class*="card"], [class*="item"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = cards.nth(i);
      if (await card.isVisible()) {
        const box = await card.boundingBox();
        expect(box).toBeTruthy();
      }
      await page.waitForTimeout(600);
    }
    const images = page.locator('img');
    for (let i = 0; i < Math.min(await images.count(), 5); i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
      await page.waitForTimeout(400);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Checkout flow no JS errors during complete interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
  });

  test('Checkout flow multi-cycle page navigation', async ({ page }) => {
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.goto('/');
      await expect(page).toHaveURL(/storedemo/);
      await page.waitForTimeout(1500);
      await page.goto('/products');
      await expect(page).toHaveURL(/products/);
      await page.waitForTimeout(1500);
      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 10000 });
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1500);
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Checkout flow reload stability', async ({ page }) => {
    await page.goto('/products');
    const titleBefore = await page.title();
    const linksBefore = await page.locator('a').count();
    await page.waitForTimeout(2000);
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      expect(await page.title()).toBe(titleBefore);
      expect(await page.locator('a').count()).toBe(linksBefore);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Checkout flow HTTPS enforcement across pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/https/);
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await expect(page).toHaveURL(/https/);
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/https/);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/https/);
  });

  test('Checkout flow performance multi-page timing', async ({ page }) => {
    const start1 = Date.now();
    await page.goto('/');
    expect(Date.now() - start1).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const start2 = Date.now();
    await page.goto('/products');
    expect(Date.now() - start2).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    const start3 = Date.now();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    expect(Date.now() - start3).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const start4 = Date.now();
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    expect(Date.now() - start4).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test('Checkout flow full scroll journey on products page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const steps = 10;
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

  test('Checkout flow keyboard navigation', async ({ page }) => {
    await page.goto('/products');
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
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Checkout flow CSS and visual structure', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const styles = page.locator('link[rel="stylesheet"], style');
    expect(await styles.count()).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    const container = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(container).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    const footerBox = await footer.boundingBox();
    expect(footerBox).toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
  });

  test('Checkout flow link integrity on products page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const href = await allLinks.nth(i).getAttribute('href');
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

  test('Checkout flow deep back/forward navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Checkout flow image verification across pages', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const images = page.locator('img');
    const imgCount = await images.count();
    expect(imgCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(imgCount, 8); i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
      if (await images.nth(i).isVisible()) {
        const box = await images.nth(i).boundingBox();
        expect(box).toBeTruthy();
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

  // ❌ FAIL (7)
  test('Checkout page shows shipping form by default', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);
    const form = page.locator('[data-testid="shipping-form"]');
    await expect(form).toBeVisible({ timeout: 3000 });
  });

  test('Payment methods include PayPal option', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const paypal = page.locator('text=Pay with PayPal');
    await expect(paypal).toBeVisible({ timeout: 3000 });
  });

  test('Order summary shows tax calculation', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const tax = page.locator('[data-testid="tax-amount"]');
    await expect(tax).toBeVisible({ timeout: 3000 });
  });

  test('Checkout displays order confirmation number', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const orderNum = page.locator('[data-testid="order-confirmation-number"]');
    await expect(orderNum).toBeVisible({ timeout: 3000 });
  });

  test('Checkout shows estimated delivery date', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const delivery = page.locator('[data-testid="estimated-delivery"]');
    await expect(delivery).toBeVisible({ timeout: 3000 });
  });

  test('Checkout progress bar shows 4 steps', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const steps = page.locator('[data-testid="checkout-step"]');
    await expect(steps).toHaveCount(4, { timeout: 3000 });
  });

  test('Checkout displays gift wrap option', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const giftWrap = page.locator('[data-testid="gift-wrap-option"]');
    await expect(giftWrap).toBeVisible({ timeout: 3000 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Checkout redirect timing', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/storedemo/);
  });

  test('Flaky - Payment gateway connection', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Flaky - Checkout form validation timing', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const btn = page.locator('button').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (2)
  test.skip('Guest checkout without account', async ({ page }) => {
    await page.goto('/checkout');
  });

  test.skip('Express checkout with saved payment', async ({ page }) => {
    await page.goto('/checkout');
  });

});
