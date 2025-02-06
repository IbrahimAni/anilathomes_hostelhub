import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  reporter: [["html"], ["list"]],
  use: {
    browserName: "chromium",
    headless: true,
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    video: "on-first-retry",
    screenshot: "only-on-failure",
  },
});
