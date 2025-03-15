import { testData } from "@/tests-utils/data/testData";
import { auth } from "@/config/firebase-admin";

export const createTestUser = async (email: string, displayName?: string) => {
    try {
        // Create a new user in Firebase Authentication
        const userRecord = await auth.createUser({
            email,
            emailVerified: true,
            password: testData.validPassword,
            displayName,
        });

        return userRecord;
    } catch (error) {
        console.error("Error creating test user:", error);
        throw error;
    }
};
