import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation', () => {

  // ✅ PASS (15)
  test('Full homepage load and content verification', async ({ page }) => {
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
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const navLinks = page.locator('nav a, header a');
    const navCount = await navLinks.count();
    expect(navCount).toBeGreaterThan(0);
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
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    const url = page.url();
    expect(url).toContain('https');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 4));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 3) / 4));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    const footerText = await footer.textContent();
    expect(footerText!.length).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await expect(header).toBeVisible();
  });

  test('Complete multi-page navigation flow with assertions', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    let response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/products/);
    const productsTitle = await page.title();
    expect(productsTitle.length).toBeGreaterThan(0);
    const productsNav = page.locator('nav').first();
    await expect(productsNav).toBeVisible();
    const productsHeader = page.locator('header').first();
    await expect(productsHeader).toBeVisible();
    const productCards = page.locator('[class*="product"], [class*="card"], [class*="item"]').first();
    await expect(productCards).toBeVisible({ timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const productsFooter = page.locator('footer').first();
    await expect(productsFooter).toBeVisible();
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/storedemo/);
    const homeHeader = page.locator('header').first();
    await expect(homeHeader).toBeVisible({ timeout: 10000 });
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(1500);
    response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    await page.waitForTimeout(1500);
    await page.goto('/');
    const finalBody = page.locator('body');
    await expect(finalBody).toBeVisible();
    const finalText = await finalBody.textContent();
    expect(finalText!.trim().length).toBeGreaterThan(10);
  });

  test('Homepage reload stability and DOM consistency check', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    const headerBefore = page.locator('header').first();
    await expect(headerBefore).toBeVisible({ timeout: 10000 });
    const navBefore = page.locator('nav').first();
    await expect(navBefore).toBeVisible();
    const titleBefore = await page.title();
    expect(titleBefore.length).toBeGreaterThan(0);
    const linksBefore = page.locator('a');
    const linksCountBefore = await linksBefore.count();
    expect(linksCountBefore).toBeGreaterThan(0);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/storedemo/);
    const headerAfter = page.locator('header').first();
    await expect(headerAfter).toBeVisible({ timeout: 10000 });
    const navAfter = page.locator('nav').first();
    await expect(navAfter).toBeVisible();
    const titleAfter = await page.title();
    expect(titleAfter).toBe(titleBefore);
    const linksAfter = page.locator('a');
    const linksCountAfter = await linksAfter.count();
    expect(linksCountAfter).toBe(linksCountBefore);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const headerThird = page.locator('header').first();
    await expect(headerThird).toBeVisible({ timeout: 10000 });
    const titleThird = await page.title();
    expect(titleThird).toBe(titleBefore);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footerAfter = page.locator('footer').first();
    await expect(footerAfter).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await expect(headerThird).toBeVisible();
  });

  test('Homepage no JavaScript errors during full interaction', async ({ page }) => {
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
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    expect(errors.length).toBe(0);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const text = await body.textContent();
    expect(text!.trim().length).toBeGreaterThan(10);
  });

  test('Homepage CSS and visual structure verification', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const styles = page.locator('link[rel="stylesheet"], style');
    const styleCount = await styles.count();
    expect(styleCount).toBeGreaterThan(0);
    const viewport = page.locator('meta[name="viewport"]');
    const vpCount = await viewport.count();
    expect(vpCount).toBeGreaterThan(0);
    const container = page.locator('#root, #app, [class*="container"], main').first();
    await expect(container).toBeVisible({ timeout: 10000 });
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    expect(headerBox!.y).toBeLessThan(100);
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const navBox = await nav.boundingBox();
    expect(navBox).toBeTruthy();
    const imgs = page.locator('img');
    const imgCount = await imgs.count();
    expect(imgCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(imgCount, 5); i++) {
      const img = imgs.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      await page.waitForTimeout(500);
    }
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
    await page.waitForTimeout(1500);
  });

  test('Homepage link integrity and navigation targets', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    const hrefs: string[] = [];
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      if (href) hrefs.push(href);
      await page.waitForTimeout(300);
    }
    expect(hrefs.length).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const headerLinks = page.locator('header a, nav a');
    const headerLinkCount = await headerLinks.count();
    expect(headerLinkCount).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footerLinks = page.locator('footer a');
    const footerLinkCount = await footerLinks.count();
    expect(footerLinkCount).toBeGreaterThanOrEqual(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(1500);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(1500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Homepage keyboard navigation and focus traversal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
    await page.keyboard.press('Home');
    await page.waitForTimeout(1000);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    await page.keyboard.press('Space');
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toContain('https');
    if (!currentUrl.includes('storedemo')) {
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
    }
    await page.waitForTimeout(1500);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('Homepage performance and load time validation', async ({ page }) => {
    const start1 = Date.now();
    await page.goto('/');
    const loadTime1 = Date.now() - start1;
    expect(loadTime1).toBeLessThan(30000);
    await expect(page).toHaveURL(/storedemo/);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    const start2 = Date.now();
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const loadTime2 = Date.now() - start2;
    expect(loadTime2).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const start3 = Date.now();
    await page.goto('/products');
    const loadTime3 = Date.now() - start3;
    expect(loadTime3).toBeLessThan(30000);
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const start4 = Date.now();
    await page.goto('/');
    const loadTime4 = Date.now() - start4;
    expect(loadTime4).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Homepage full scroll journey with element checks at each viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(0);
    const steps = 8;
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

  test('Homepage to product detail deep navigation flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    const homeTitle = await page.title();
    expect(homeTitle.length).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const productCard = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });
    await productCard.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const detailBody = page.locator('body');
    await expect(detailBody).toBeVisible();
    const detailText = await detailBody.textContent();
    expect(detailText!.trim().length).toBeGreaterThan(10);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(1500);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    const finalHeader = page.locator('header').first();
    await expect(finalHeader).toBeVisible({ timeout: 10000 });
  });

  test('Homepage responsive elements and image loading verification', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const allImages = page.locator('img');
    const totalImages = await allImages.count();
    expect(totalImages).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(totalImages, 8); i++) {
      const img = allImages.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      const isVisible = await img.isVisible();
      if (isVisible) {
        const box = await img.boundingBox();
        expect(box).toBeTruthy();
      }
      await page.waitForTimeout(600);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    const midImages = page.locator('img:visible');
    const midCount = await midImages.count();
    expect(midCount).toBeGreaterThanOrEqual(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Homepage multiple full navigation cycles', async ({ page }) => {
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.goto('/');
      await expect(page).toHaveURL(/storedemo/);
      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 10000 });
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      await page.waitForTimeout(1500);
      await page.goto('/products');
      await expect(page).toHaveURL(/products/);
      const prodBody = page.locator('body');
      await expect(prodBody).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);
    }
    const finalBody = page.locator('body');
    await expect(finalBody).toBeVisible();
    const finalText = await finalBody.textContent();
    expect(finalText!.trim().length).toBeGreaterThan(10);
  });

  test('Homepage footer content and link verification with scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(2000);
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let pos = 0; pos <= scrollHeight; pos += 300) {
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.waitForTimeout(400);
    }
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    const footerText = await footer.textContent();
    expect(footerText!.length).toBeGreaterThan(0);
    const footerLinks = page.locator('footer a');
    const flCount = await footerLinks.count();
    expect(flCount).toBeGreaterThanOrEqual(0);
    if (flCount > 0) {
      for (let i = 0; i < Math.min(flCount, 5); i++) {
        const href = await footerLinks.nth(i).getAttribute('href');
        expect(href).toBeTruthy();
        await page.waitForTimeout(500);
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    await expect(header).toBeVisible();
  });

  test('Homepage document metadata and SEO elements check', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
    const charset = page.locator('meta[charset]');
    expect(await charset.count()).toBeGreaterThanOrEqual(0);
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    const stylesheets = page.locator('link[rel="stylesheet"]');
    const ssCount = await stylesheets.count();
    expect(ssCount).toBeGreaterThan(0);
    const scripts = page.locator('script[src]');
    const scriptCount = await scripts.count();
    expect(scriptCount).toBeGreaterThanOrEqual(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const body = page.locator('body');
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(50);
  });

  test('Homepage browser back forward with full assertions', async ({ page }) => {
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
    const prodNav = page.locator('nav').first();
    await expect(prodNav).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const backTitle = await page.title();
    expect(backTitle).toBe(homeTitle);
    const homeHeader = page.locator('header').first();
    await expect(homeHeader).toBeVisible({ timeout: 10000 });
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    const fwdNav = page.locator('nav').first();
    await expect(fwdNav).toBeVisible();
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/storedemo/);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    const finalBody = page.locator('body');
    await expect(finalBody).toBeVisible();
  });

  // ❌ FAIL (7)
  test('Homepage should have login modal open by default', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const modal = page.locator('[data-testid="login-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
  });

  test('Verify promo banner displays discount code', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const banner = page.locator('text=DISCOUNT50');
    await expect(banner).toBeVisible({ timeout: 3000 });
  });

  test('Homepage should have exactly 50 products', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const products = page.locator('.product-card');
    await expect(products).toHaveCount(50, { timeout: 3000 });
  });

  test('Homepage should display countdown timer for flash sale', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const timer = page.locator('[data-testid="flash-sale-timer"]');
    await expect(timer).toBeVisible({ timeout: 3000 });
  });

  test('Homepage newsletter subscription form visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const newsletterForm = page.locator('[data-testid="newsletter-form"]');
    await expect(newsletterForm).toBeVisible({ timeout: 3000 });
  });

  test('Homepage should show live chat widget', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const chatWidget = page.locator('[data-testid="live-chat-widget"]');
    await expect(chatWidget).toBeVisible({ timeout: 3000 });
  });

  test('Homepage breadcrumb should show Home label', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const breadcrumb = page.locator('[data-testid="breadcrumb"] >> text=Home');
    await expect(breadcrumb).toBeVisible({ timeout: 3000 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Homepage load time check', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page).not.toHaveURL('about:blank');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Flaky - Navigation menu render timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await page.waitForTimeout(3000);
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('Flaky - Footer lazy load detection', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  // ⏭️ SKIP (2)
  test.skip('Dark mode toggle on homepage', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="dark-mode-toggle"]');
  });

  test.skip('Accessibility - Homepage keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
  });

});
