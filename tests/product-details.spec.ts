import { test, expect } from '@playwright/test';

test.describe('Product Details', () => {

  // ✅ PASS (15)
  test('Product detail full page load and content deep check', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const productCard = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });
    await productCard.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(10);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const url = page.url();
    expect(url).toContain('https');
    const images = page.locator('img');
    const imgCount = await images.count();
    expect(imgCount).toBeGreaterThan(0);
    const firstImg = page.locator('img').first();
    await expect(firstImg).toBeVisible({ timeout: 10000 });
    const src = await firstImg.getAttribute('src');
    expect(src).toBeTruthy();
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

  test('Product detail image gallery deep inspection', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const allImages = page.locator('img');
    const totalImages = await allImages.count();
    expect(totalImages).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(totalImages, 8); i++) {
      const img = allImages.nth(i);
      const imgSrc = await img.getAttribute('src');
      expect(imgSrc).toBeTruthy();
      const isVis = await img.isVisible();
      if (isVis) {
        const box = await img.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.height).toBeGreaterThan(0);
      }
      await page.waitForTimeout(600);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Product detail multi-product browsing flow', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    for (let round = 0; round < 3; round++) {
      const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
      await expect(card).toBeVisible({ timeout: 10000 });
      await card.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
      const text = await body.textContent();
      expect(text!.trim().length).toBeGreaterThan(10);
      const imgs = page.locator('img');
      const imgCount = await imgs.count();
      expect(imgCount).toBeGreaterThan(0);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/products/);
    }
    const finalHeader = page.locator('header').first();
    await expect(finalHeader).toBeVisible({ timeout: 10000 });
  });

  test('Product detail no JS errors during full page interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
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
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Product detail page reload stability', async ({ page }) => {
    await page.goto('/products');
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const titleBefore = await page.title();
    const textBefore = await page.locator('body').textContent();
    expect(textBefore!.trim().length).toBeGreaterThan(10);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const titleAfter = await page.title();
    expect(titleAfter).toBe(titleBefore);
    const textAfter = await page.locator('body').textContent();
    expect(textAfter!.trim().length).toBeGreaterThan(10);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const titleThird = await page.title();
    expect(titleThird).toBe(titleBefore);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Product detail CSS structure and bounding box validation', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
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
    expect(containerBox!.width).toBeGreaterThan(0);
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

  test('Product detail full scroll journey with viewport checks', async ({ page }) => {
    await page.goto('/products');
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(0);
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps);
      await page.waitForTimeout(1500);
      const visBody = page.locator('body');
      await expect(visBody).toBeVisible();
    }
    for (let i = steps; i >= 0; i--) {
      await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps);
      await page.waitForTimeout(1500);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Product detail page performance and load timing', async ({ page }) => {
    const start1 = Date.now();
    await page.goto('/products');
    const productsLoad = Date.now() - start1;
    expect(productsLoad).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    const start2 = Date.now();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    const detailLoad = Date.now() - start2;
    expect(detailLoad).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const start3 = Date.now();
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const reloadTime = Date.now() - start3;
    expect(reloadTime).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
  });

  test('Product detail deep navigation home > products > detail > back > home', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(2000);
    const homeHeader = page.locator('header').first();
    await expect(homeHeader).toBeVisible({ timeout: 10000 });
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
    const finalBody = page.locator('body');
    await expect(finalBody).toBeVisible();
    const finalTitle = await page.title();
    expect(finalTitle.length).toBeGreaterThan(0);
  });

  test('Product detail links and buttons integrity', async ({ page }) => {
    await page.goto('/products');
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(linkCount, 8); i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      await page.waitForTimeout(400);
    }
    const buttons = page.locator('button');
    const btnCount = await buttons.count();
    expect(btnCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(btnCount, 5); i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        expect(await btn.isEnabled()).toBeTruthy();
      }
      await page.waitForTimeout(400);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Product detail keyboard navigation', async ({ page }) => {
    await page.goto('/products');
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
    await page.keyboard.press('End');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Home');
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
  });

  test('Products page listing returns 200 with full assertions', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const text = await body.textContent();
    expect(text!.trim().length).toBeGreaterThan(50);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const images = page.locator('img');
    expect(await images.count()).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    await expect(header).toBeVisible();
    await page.waitForTimeout(2000);
  });

  test('Product detail multi-reload with scroll', async ({ page }) => {
    await page.goto('/products');
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1500);
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
      const text = await body.textContent();
      expect(text!.trim().length).toBeGreaterThan(10);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  // ❌ FAIL (7)
  test('Product detail shows 360-degree view button', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const btn = page.locator('[data-testid="360-view"]');
    await expect(btn).toBeVisible({ timeout: 3000 });
  });

  test('Product detail has size selector', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const selector = page.locator('[data-testid="size-selector"]');
    await expect(selector).toBeVisible({ timeout: 3000 });
  });

  test('Product availability shows In Stock 150 units', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const stock = page.locator('text=In Stock: 150 units');
    await expect(stock).toBeVisible({ timeout: 3000 });
  });

  test('Product detail should show customer reviews section', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const reviews = page.locator('[data-testid="customer-reviews"]');
    await expect(reviews).toBeVisible({ timeout: 3000 });
  });

  test('Product detail should display color swatches', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const swatches = page.locator('[data-testid="color-swatches"]');
    await expect(swatches).toBeVisible({ timeout: 3000 });
  });

  test('Product detail should show related products carousel', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const carousel = page.locator('[data-testid="related-products"]');
    await expect(carousel).toBeVisible({ timeout: 3000 });
  });

  test('Product detail should show add to wishlist button', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const wishlistBtn = page.locator('[data-testid="add-to-wishlist"]');
    await expect(wishlistBtn).toBeVisible({ timeout: 3000 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Product image gallery loads', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Product detail tab switching', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Flaky - Product zoom feature', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (2)
  test.skip('Product comparison feature', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="compare-btn"]');
  });

  test.skip('Product 3D model viewer', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="3d-viewer"]');
  });

});
