// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__', // ✅ Baseline image storage
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 1, // Enable retries for flaky test behavior
  workers: isCI ? 5 : 5,

  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['blob', { outputDir: 'blob-report' }], // Blob reporter for merging
    ['json', { outputFile: './playwright-report/report.json' }],
    // Only enable TestDino when token is set (use TESTDINO_SERVER_URL in CI if staging is unreachable)
    ...(process.env.TESTDINO_TOKEN
      ? ([
          [
            '@testdino/playwright',
            {
              token: process.env.TESTDINO_TOKEN,
              serverUrl:
                process.env.TESTDINO_SERVER_URL ||
                'https://staging-api.testdino.com',
            },
          ],
        ] as const)
      : []),
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com/products',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grep: /@chromium/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@firefox/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@webkit/,
    },
    {
      name: 'android',
      use: { ...devices['Pixel 5'] },
      grep: /@android/,
    },
    {
      name: 'ios',
      use: { ...devices['iPhone 12'] },
      grep: /@ios/,
    },
    {
      name: 'api',
      use: { ...devices['API'] },
      grep: /@api/,
    },
  ],
});
