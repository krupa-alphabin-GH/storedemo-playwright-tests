import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 2,
  fullyParallel: true,
  workers: 5,
  reporter: 'html',
  use: {
    baseURL: 'https://storedemo.testdino.com',
    headless: true,
  },
});
