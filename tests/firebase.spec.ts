import { test, expect } from "@playwright/test";

test("", async ({page}) => {
  await page.goto("/");
  expect(true).toBe(true);

});
