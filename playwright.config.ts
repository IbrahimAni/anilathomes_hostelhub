import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  workers: process.env.CI ? undefined : 1,
  reporter: [["html"], ["list"]],
  timeout: 100000,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  use: {
    browserName: "chromium",
    headless: true,
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    video: "on-first-retry",
    screenshot: "only-on-failure",
    testIdAttribute: "data-testid",
    permissions: ["clipboard-read", "clipboard-write"],
  },
});
