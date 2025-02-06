import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: {
    browserName: 'chromium',
    headless: true,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  reporter: 'list',
});