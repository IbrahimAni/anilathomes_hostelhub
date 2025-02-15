import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  reporter: [["html"], ["list"]],

  use: {
    browserName: "chromium",
    headless: true,
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    video: "on-first-retry",
    screenshot: "only-on-failure",
    testIdAttribute: "data-testid",
    permissions: ["clipboard-read", "clipboard-write"],
  },
});
