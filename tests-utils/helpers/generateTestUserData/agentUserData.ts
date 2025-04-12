import { db } from '@/config/firebase-admin';
import { genRandomNumber } from '../genRandomNumber';
import { testData } from '@/tests-utils/data/testData';
import { createTestUser } from '../functions/createTestUserHelper';
import type { UserRole } from '@/types/user';

const {userProfile} = testData;
const testEmailDomain = "@wptest.com";
const userRole: UserRole = "agent";

/**
 * Generates a test user with agent role for testing purposes
 * @returns Promise with an object containing the user ID and email
 */
export const genAgentTestUser = async (testEmail? : string): Promise<{userId: string, email: string, displayName: string}> => {
  try {
    const agentEmail = testEmail || `agent-test-user-${genRandomNumber()}${testEmailDomain}`;
    
    // Set expiration timestamp (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    const userRecord = await createTestUser(agentEmail, userProfile.displayName);

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      displayName: userRecord.displayName,
      email: userRecord.email,
      emailVerified: false,
      phoneNumber: null,
      photoURL: null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      role: userRole,
      expiresAt,
    });

return {
    userId: userRecord.uid,
    email: agentEmail,
    displayName: "Alice Johnson",
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};