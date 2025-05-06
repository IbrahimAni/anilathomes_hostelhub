import {test as base} from "@playwright/test";
import { AddPropertyPage } from "@/tests-utils/pages/AddPropertyPage";
import { cleanupTestUsers } from "@/tests-utils/helpers/cleanupTestData/cleanupTestUsers";

type MyFixtures = {
    addPropertyPage: AddPropertyPage;
    testCleanup: void;
}

export const test = base.extend<MyFixtures>({
    // Base page objects
    addPropertyPage: async ({ page }, use) => {
        const addPropertyPage = new AddPropertyPage(page);
        await use(addPropertyPage);
    },

    // Auto-cleanup fixture
    testCleanup: [async ({}, use) => {
        // Setup (runs before test)
        await use();
        // Teardown (runs after test)
        await cleanupTestUsers();
    },{auto: true}] // auto: true means this fixture runs automatically for all tests
});

export { expect } from "@playwright/test";