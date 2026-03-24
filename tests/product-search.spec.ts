import { test, expect } from '@playwright/test';

test.describe('Product Search', () => {

  // ✅ PASS (15)
  test('Search bar full interaction and input validation', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await expect(searchInput).toBeEnabled();
    const placeholder = await searchInput.getAttribute('placeholder');
    const ariaLabel = await searchInput.getAttribute('aria-label');
    expect(placeholder || ariaLabel).toBeTruthy();
    await searchInput.click();
    await page.waitForTimeout(1000);
    await searchInput.fill('laptop');
    await page.waitForTimeout(1500);
    let value = await searchInput.inputValue();
    expect(value).toBe('laptop');
    await searchInput.fill('');
    await page.waitForTimeout(1000);
    value = await searchInput.inputValue();
    expect(value).toBe('');
    await searchInput.fill('phone case');
    await page.waitForTimeout(1500);
    value = await searchInput.inputValue();
    expect(value).toBe('phone case');
    await searchInput.fill('');
    await page.waitForTimeout(1000);
    await page.keyboard.type('keyboard typed query', { delay: 50 });
    await page.waitForTimeout(1500);
    value = await searchInput.inputValue();
    expect(value).toContain('keyboard typed query');
    await searchInput.fill('');
    await page.waitForTimeout(1000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
  });

  test('Search page full content and structure verification', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/products/);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const body = page.locator('body');
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(10);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    const images = page.locator('img');
    expect(await images.count()).toBeGreaterThan(0);
    const firstImg = page.locator('img').first();
    await expect(firstImg).toBeVisible({ timeout: 10000 });
    const src = await firstImg.getAttribute('src');
    expect(src).toBeTruthy();
    await page.waitForTimeout(2000);
    const styles = page.locator('link[rel="stylesheet"], style');
    expect(await styles.count()).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Search multiple queries sequentially with clearing', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    const queries = ['laptop', 'phone', 'tablet', 'headphones', 'camera', 'watch', 'speaker'];
    for (const query of queries) {
      await searchInput.fill(query);
      await page.waitForTimeout(1500);
      const value = await searchInput.inputValue();
      expect(value).toBe(query);
      await searchInput.fill('');
      await page.waitForTimeout(800);
      const cleared = await searchInput.inputValue();
      expect(cleared).toBe('');
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Search page reload stability with input persistence check', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    const titleBefore = await page.title();
    const linksBefore = await page.locator('a').count();
    await page.waitForTimeout(2000);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const titleAfter = await page.title();
    expect(titleAfter).toBe(titleBefore);
    const linksAfter = await page.locator('a').count();
    expect(linksAfter).toBe(linksBefore);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Search page no JS errors during typing interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.click();
    await page.waitForTimeout(1000);
    await page.keyboard.type('test search query', { delay: 80 });
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await searchInput.fill('');
    await page.waitForTimeout(1000);
    await page.keyboard.type('another query', { delay: 80 });
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Search page navigation flow with search interaction', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('test');
    await page.waitForTimeout(1500);
    const value = await searchInput.inputValue();
    expect(value).toBe('test');
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const searchInputAgain = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInputAgain).toBeVisible({ timeout: 10000 });
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Search page keyboard typing with special characters', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('test-query');
    await page.waitForTimeout(1500);
    expect(await searchInput.inputValue()).toBe('test-query');
    await searchInput.fill('test_underscore');
    await page.waitForTimeout(1500);
    expect(await searchInput.inputValue()).toBe('test_underscore');
    await searchInput.fill('test 123');
    await page.waitForTimeout(1500);
    expect(await searchInput.inputValue()).toBe('test 123');
    await searchInput.fill('UPPERCASE');
    await page.waitForTimeout(1500);
    expect(await searchInput.inputValue()).toBe('UPPERCASE');
    await searchInput.fill('mixed Case Query');
    await page.waitForTimeout(1500);
    expect(await searchInput.inputValue()).toBe('mixed Case Query');
    await searchInput.fill('');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Search page images and product cards verification', async ({ page }) => {
    await page.goto('/products');
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
      await page.waitForTimeout(500);
    }
    const cards = page.locator('[class*="product"], [class*="card"], [class*="item"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Search field focus and blur cycle test', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    for (let i = 0; i < 5; i++) {
      await searchInput.click();
      await page.waitForTimeout(1000);
      await searchInput.fill(`query ${i + 1}`);
      await page.waitForTimeout(1000);
      expect(await searchInput.inputValue()).toBe(`query ${i + 1}`);
      await page.locator('body').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(1000);
      await searchInput.fill('');
      await page.waitForTimeout(500);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Search page multi-cycle navigation with assertions', async ({ page }) => {
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.goto('/products');
      await expect(page).toHaveURL(/products/);
      await page.waitForTimeout(1500);
      const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
      await expect(searchInput).toBeVisible({ timeout: 10000 });
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      await searchInput.fill(`cycle ${cycle + 1}`);
      await page.waitForTimeout(1500);
      expect(await searchInput.inputValue()).toBe(`cycle ${cycle + 1}`);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1500);
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Search page performance and load timing', async ({ page }) => {
    const start1 = Date.now();
    await page.goto('/products');
    const load1 = Date.now() - start1;
    expect(load1).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    const start2 = Date.now();
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const load2 = Date.now() - start2;
    expect(load2).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    const start3 = Date.now();
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const load3 = Date.now() - start3;
    expect(load3).toBeLessThan(30000);
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Search page full scroll journey', async ({ page }) => {
    await page.goto('/products');
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
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('Search page tab navigation through elements', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Search page CSS and layout structure check', async ({ page }) => {
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
    const containerBox = await container.boundingBox();
    expect(containerBox).toBeTruthy();
    expect(containerBox!.width).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    const searchBox = await searchInput.boundingBox();
    expect(searchBox).toBeTruthy();
    expect(searchBox!.width).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    const footerBox = await footer.boundingBox();
    expect(footerBox).toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  // ❌ FAIL (7)
  test('Search for xyz123 shows No results message', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const noResults = page.locator('text=No results found for "xyz123"');
    await expect(noResults).toBeVisible({ timeout: 3000 });
  });

  test('Search suggestions dropdown appears on typing', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const dropdown = page.locator('[data-testid="search-suggestions"]');
    await expect(dropdown).toBeVisible({ timeout: 3000 });
  });

  test('Voice search button is present', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const voiceBtn = page.locator('[aria-label="Voice search"]');
    await expect(voiceBtn).toBeVisible({ timeout: 3000 });
  });

  test('Search filter by category visible', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const filter = page.locator('[data-testid="search-category-filter"]');
    await expect(filter).toBeVisible({ timeout: 3000 });
  });

  test('Search results should show result count', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const count = page.locator('[data-testid="search-result-count"]');
    await expect(count).toBeVisible({ timeout: 3000 });
  });

  test('Advanced search link visible', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const link = page.locator('text=Advanced Search');
    await expect(link).toBeVisible({ timeout: 3000 });
  });

  test('Search autocomplete shows top 5 suggestions', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const suggestions = page.locator('[data-testid="autocomplete-item"]');
    await expect(suggestions).toHaveCount(5, { timeout: 3000 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Search results load time', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    await expect(page).not.toHaveURL('about:blank');
  });

  test('Flaky - Search debounce timing', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Search index refresh', async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/products/);
  });

  // ⏭️ SKIP (2)
  test.skip('Search history shows recent searches', async ({ page }) => {
    await page.goto('/products');
  });

  test.skip('Image search by uploading photo', async ({ page }) => {
    await page.goto('/products');
  });

});
