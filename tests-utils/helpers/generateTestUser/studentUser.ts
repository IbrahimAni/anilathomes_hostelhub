import { UserRole } from '@/types/user';
import { auth, db } from '@/config/firebase-admin';
import { genRandomNumber } from '../genRandomNumber';
import { testData } from '@/tests-utils/data/testData';

// Password for the test user
const {validPassword} = testData;
//Email domain for test users
const testEmailDomain = "@wptest.com";

/**
 * Generates a test user with student role for testing purposes
 * @returns Promise with an object containing the user ID and email
 */
export const genStudentTestUser = async (testEmail? : string): Promise<{userId: string, email: string, displayName: string}> => {
  try {
    // Generate random email to avoid conflicts
    const studentEmail = testEmail || `student-test-user-${genRandomNumber()}${testEmailDomain}`;
    
    // Display Name for the test user
    const displayName = 'Ipsum Manifest';
    
    // Set expiration timestamp (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 1);
    // expiresAt.setHours(expiresAt.getHours() + 2);
        
    const userRecord = await auth.createUser({
      email: studentEmail,
      emailVerified: true,
      password: validPassword,
      displayName: displayName,
    });

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      displayName: userRecord.displayName,
      email: userRecord.email,
      emailVerified: false,
      phoneNumber: null,
      photoURL: null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      role: "student",
      expiresAt,
    });

  return {
      userId: userRecord.uid,
      email: studentEmail,
      displayName: "Ipsum Manifest",
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};