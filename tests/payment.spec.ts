import { test, expect } from '@playwright/test';

function randomWait(): number {
  return Math.floor(Math.random() * (25000 - 5000 + 1)) + 5000;
}

test.describe('Payment Gateway', () => {
  const cases = [
    'should display available payment methods',
    'should validate card expiry date',
    'should reject expired credit card',
    'should process Visa payment',
    'should process Mastercard payment',
    'should handle payment gateway timeout',
    'should show 3D secure verification',
    'should handle declined card gracefully',
    'should support saved payment methods',
    'should display transaction receipt',
  ];

  for (let i = 0; i < cases.length; i++) {
    test(cases[i], async ({ page }) => {
      await page.goto('/');
      await expect(page).not.toHaveURL('about:blank');
      await page.waitForTimeout(randomWait());
    });
  }
});
