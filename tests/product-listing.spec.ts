import { test, expect } from '@playwright/test';

test.describe('Product Listing', () => {

  // ✅ PASS (15)
  test('Products page full load and content verification', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/products/);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(10);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    const productCards = page.locator('[class*="product"], [class*="card"], [class*="item"]').first();
    await expect(productCards).toBeVisible({ timeout: 10000 });
    const images = page.locator('img');
    const imgCount = await images.count();
    expect(imgCount).toBeGreaterThan(0);
    const firstImg = page.locator('img').first();
    await expect(firstImg).toBeVisible({ timeout: 10000 });
    const src = await firstImg.getAttribute('src');
    expect(src).toBeTruthy();
    const buttons = page.locator('button, [role="button"]');
    const btnCount = await buttons.count();
    expect(btnCount).toBeGreaterThan(0);
    const links = page.locator('a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(1);
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

  test('Products page image gallery deep inspection', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const allImages = page.locator('img');
    const totalImages = await allImages.count();
    expect(totalImages).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(totalImages, 10); i++) {
      const img = allImages.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      const isVisible = await img.isVisible();
      if (isVisible) {
        const box = await img.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.height).toBeGreaterThan(0);
      }
      await page.waitForTimeout(500);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2500);
    const midImages = page.locator('img');
    const midCount = await midImages.count();
    expect(midCount).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Products page full scroll with element checks at each level', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(0);
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const scrollTo = (scrollHeight * i) / steps;
      await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
      await page.waitForTimeout(1500);
      const visibleBody = page.locator('body');
      await expect(visibleBody).toBeVisible();
    }
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    for (let i = steps; i >= 0; i--) {
      const scrollTo = (scrollHeight * i) / steps;
      await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
      await page.waitForTimeout(1500);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('Products page reload stability with DOM consistency', async ({ page }) => {
    await page.goto('/products');
    const titleBefore = await page.title();
    const linksBefore = await page.locator('a').count();
    const imgsBefore = await page.locator('img').count();
    await page.waitForTimeout(2000);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const titleAfter = await page.title();
    expect(titleAfter).toBe(titleBefore);
    const linksAfter = await page.locator('a').count();
    expect(linksAfter).toBe(linksBefore);
    const imgsAfter = await page.locator('img').count();
    expect(imgsAfter).toBe(imgsBefore);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const titleThird = await page.title();
    expect(titleThird).toBe(titleBefore);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Products page no JS errors during full interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 4));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 3) / 4));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    const productCard = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });
    await productCard.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Products page navigate to detail and back multiple times', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    for (let i = 0; i < 3; i++) {
      const productCard = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
      await expect(productCard).toBeVisible({ timeout: 10000 });
      await productCard.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const detailBody = page.locator('body');
      await expect(detailBody).toBeVisible();
      const detailText = await detailBody.textContent();
      expect(detailText!.trim().length).toBeGreaterThan(10);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/products/);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Products page link and button integrity check', async ({ page }) => {
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
    const allButtons = page.locator('button');
    const btnCount = await allButtons.count();
    expect(btnCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(btnCount, 5); i++) {
      const btn = allButtons.nth(i);
      const isVisible = await btn.isVisible();
      if (isVisible) {
        const isEnabled = await btn.isEnabled();
        expect(isEnabled).toBeTruthy();
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

  test('Products page multi-cycle home to products navigation', async ({ page }) => {
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.goto('/');
      await expect(page).toHaveURL(/storedemo/);
      await page.waitForTimeout(1500);
      const homeHeader = page.locator('header').first();
      await expect(homeHeader).toBeVisible({ timeout: 10000 });
      await page.goto('/products');
      await expect(page).toHaveURL(/products/);
      await page.waitForTimeout(1500);
      const prodHeader = page.locator('header').first();
      await expect(prodHeader).toBeVisible({ timeout: 10000 });
      const prodNav = page.locator('nav').first();
      await expect(prodNav).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page performance multi-load validation', async ({ page }) => {
    const loadTimes: number[] = [];
    for (let i = 0; i < 4; i++) {
      const start = Date.now();
      await page.goto('/products');
      await page.waitForLoadState('domcontentloaded');
      const elapsed = Date.now() - start;
      loadTimes.push(elapsed);
      expect(elapsed).toBeLessThan(30000);
      await page.waitForTimeout(2000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 10000 });
    }
    expect(loadTimes.length).toBe(4);
    for (const lt of loadTimes) {
      expect(lt).toBeLessThan(30000);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Products page CSS and layout structure verification', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const styles = page.locator('link[rel="stylesheet"], style');
    const styleCount = await styles.count();
    expect(styleCount).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    expect(headerBox!.y).toBeLessThan(100);
    expect(headerBox!.width).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    const container = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(container).toBeVisible({ timeout: 10000 });
    const containerBox = await container.boundingBox();
    expect(containerBox).toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    const midBody = page.locator('body');
    await expect(midBody).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    const footerBox = await footer.boundingBox();
    expect(footerBox).toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Products page keyboard navigation through product cards', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
    await page.waitForTimeout(1500);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
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

  test('Products page document metadata and structure', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const url = page.url();
    expect(url).toContain('https');
    expect(url).toContain('products');
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    const scripts = page.locator('script[src]');
    const scriptCount = await scripts.count();
    expect(scriptCount).toBeGreaterThanOrEqual(0);
    const stylesheets = page.locator('link[rel="stylesheet"]');
    const ssCount = await stylesheets.count();
    expect(ssCount).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(50);
  });

  test('Products page product card interaction and detail preview', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const productCards = page.locator('[class*="product"], [class*="card"], [class*="item"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = productCards.nth(i);
      const isVisible = await card.isVisible();
      if (isVisible) {
        const box = await card.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.height).toBeGreaterThan(0);
      }
      await page.waitForTimeout(800);
    }
    await page.waitForTimeout(1500);
    const firstCard = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
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
  });

  test('Products page browser back forward deep navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
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

  // // ❌ FAIL (7)
  // test('Products page should show pagination with 20 pages', async ({ page }) => {
  //   await page.goto('/products');
  //   await page.waitForTimeout(2000);
  //   await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  //   await page.waitForTimeout(2000);
  //   const pagination = page.locator('text=Page 20');
  //   await expect(pagination).toBeVisible({ timeout: 3000 });
  // });

  // test('Verify Out of Stock badge on first product', async ({ page }) => {
  //   await page.goto('/products');
  //   await page.waitForTimeout(2000);
  //   const badge = page.locator('[data-testid="out-of-stock-badge"]').first();
  //   await expect(badge).toBeVisible({ timeout: 3000 });
  // });

  test('Products sorted by price descending by default', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const sortLabel = page.locator('text=Price: High to Low');
    await expect(sortLabel).toBeVisible({ timeout: 3000 });
  });

  test('Products page should show filter sidebar', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const sidebar = page.locator('[data-testid="filter-sidebar"]');
    await expect(sidebar).toBeVisible({ timeout: 3000 });
  });

  test('Products page should display product ratings', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const rating = page.locator('[data-testid="product-rating"]').first();
    await expect(rating).toBeVisible({ timeout: 3000 });
  });

  test('Products page should show grid/list view toggle', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const toggle = page.locator('[data-testid="view-toggle"]');
    await expect(toggle).toBeVisible({ timeout: 3000 });
  });

  test('Products page should display total product count label', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const count = page.locator('text=Showing 1-20 of 500 products');
    await expect(count).toBeVisible({ timeout: 3000 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Product count validation', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/products/);
  });

  test('Flaky - Product image lazy loading', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Product card hover state', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const card = page.locator('[class*="product"], [class*="card"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
  });

  test.skip('Infinite scroll loads more products', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  test.skip('Product listing drag and drop reorder', async ({ page }) => {
    await page.goto('/products');
  });

});
