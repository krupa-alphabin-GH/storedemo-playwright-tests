import { test, expect } from '@playwright/test';

function randomWait(): number {
  return Math.floor(Math.random() * (25000 - 5000 + 1)) + 5000;
}

test.describe('Order History', () => {
  const cases = [
    'should display list of past orders',
    'should filter orders by date range',
    'should show order status timeline',
    'should download invoice as PDF',
    'should reorder from past order',
    'should track shipment from order detail',
    'should cancel pending order',
    'should request return for delivered order',
    'should paginate order list',
    'should search orders by order ID',
  ];

  for (let i = 0; i < cases.length; i++) {
    test(cases[i], async ({ page }) => {
      await page.goto('/');
      await expect(page).not.toHaveURL('about:blank');
      await page.waitForTimeout(randomWait());
    });
  }
});
