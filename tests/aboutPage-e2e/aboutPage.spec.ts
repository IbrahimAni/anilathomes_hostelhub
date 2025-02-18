import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the about page before each test
    await page.goto("/about");
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");
  });

  test("should display AboutBanner section", async ({ page }) => {
    // Verify the banner section is visible
    await expect(page.getByRole("banner")).toBeVisible();
  });

  test("should display OurStory section", async ({ page }) => {
    // Verify the Our Story section
    await expect(page.getByTestId("our-story")).toBeVisible();
  });

  test("should display OurMission section", async ({ page }) => {
    // Verify the Our Mission section
    await expect(page.getByTestId("our-mission")).toBeVisible();
  });

  test("should display Testimonials section", async ({ page }) => {
    // Verify the Testimonials section
    await expect(page.getByTestId("testimonial")).toBeVisible();
  });

  test("should display FAQ section and interact with questions", async ({
    page,
  }) => {
    // Verify FAQ section is visible
    const faqSection = page.getByTestId("faq");
    await expect(faqSection).toBeVisible();

    // Test FAQ interaction
    const firstQuestion = faqSection.getByRole("button").first();
    await firstQuestion.click();
    // Verify answer is visible after clicking
    await expect(page.getByTestId("faq-answer").first()).toBeVisible();
  });

  test("should display ContactUs section with form", async ({ page }) => {
    // Verify Contact form is present
    const contactSection = page.getByTestId("contact-section");
    await expect(contactSection).toBeVisible();

    // Verify form elements
    await expect(page.getByTestId("name-input")).toBeVisible();
    await expect(page.getByTestId("email-input")).toBeVisible();
    await expect(page.getByTestId("subject-input")).toBeVisible();
    await expect(page.getByTestId("message-input")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send Message" })
    ).toBeVisible();
  });

  // test("should submit contact form successfully", async ({ page }) => {
  //   // Fill out the contact form
  //   await page.getByTestId("name-input").fill("Test User");
  //   await page.getByTestId("email-input").fill("example@gmail.com");
  //   await page.getByTestId("subject-input").fill("Test Subject");
  //   await page.getByTestId("message-input").fill("Test Message");

  //   // Submit the form
  //   await page.getByRole("button", { name: "Send Message" }).click();

  //   // Verify success message
  //   await expect(page.getByText(/message sent successfully/i)).toBeVisible();
  // });
});
