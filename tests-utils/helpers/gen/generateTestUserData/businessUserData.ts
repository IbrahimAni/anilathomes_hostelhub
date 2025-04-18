import { db } from '@/config/firebase-admin';
import { genRandomNumber } from '../../genRandomNumber';
import { testData } from '@/tests-utils/data/testData';
import { createTestUser } from '../../functions/createTestUserHelper';
import type { UserRole } from '@/types/user';

const {userProfile} = testData;
const testEmailDomain = "@wptest.com";
const userRole: UserRole = "business";

/**
 * Generates a test user with business role for testing purposes
 * @returns Promise with an object containing the user ID and email
 */
export const genBusinessTestUser = async (testEmail? : string): Promise<{userId: string, email: string, displayName: string}> => {
  try {
    const businessEmail = testEmail || `business-test-user-${genRandomNumber()}${testEmailDomain}`;
    
    // Set expiration timestamp (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    const userRecord = await createTestUser(businessEmail, userProfile.displayName);

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
      email: businessEmail,
      displayName: "John Doe",
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};