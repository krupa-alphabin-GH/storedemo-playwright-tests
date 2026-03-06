import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  const cases = [
    'should display checkout form',
    'should validate shipping address fields',
    'should calculate tax based on region',
    'should apply free shipping on orders above threshold',
    'should show order summary before payment',
    'should validate credit card number format',
    'should process payment successfully',
    'should send order confirmation email',
    'should redirect to thank you page',
    'should generate unique order ID',
  ];

  for (let i = 0; i < cases.length; i++) {
    test(cases[i], async ({}, testInfo) => {
      if (i === 2 && testInfo.retry === 0) {
        throw new Error('Flaky element not found');
      }

      if (i === 6 && testInfo.retry === 0) {
        throw new Error('Flaky assertion timeout');
      }

      expect(true).toBe(true);
    });
  }
});
