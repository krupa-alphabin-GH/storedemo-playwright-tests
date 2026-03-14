// @ts-check
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: isCI,

  retries: isCI ? 2 : 1,
  workers: isCI ? 5 : 5,

  timeout: 15 * 1000,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['blob', { outputDir: 'blob-report' }],
    ['json', { outputFile: './playwright-report/report.json' }],
    [
      '@testdino/playwright',
      {
        token: process.env.TESTDINO_TOKEN,
        serverUrl: 'https://staging-api.testdino.com',
      },
    ],
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com',
    headless: true,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});