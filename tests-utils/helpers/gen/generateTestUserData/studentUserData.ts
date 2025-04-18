import { db } from '@/config/firebase-admin';
import { genRandomNumber } from '../../genRandomNumber';
import { testData } from '@/tests-utils/data/testData';
import { createTestUser } from '../../functions/createTestUserHelper';
import type { UserRole } from '@/types/user';

const {userProfile} = testData;
const testEmailDomain = "@wptest.com";
const userRole: UserRole = "student";

/**
 * Generates a test user with student role for testing purposes
 * @returns Promise with an object containing the user ID and email
 */
export const genStudentTestUser = async (testEmail? : string): Promise<{userId: string, email: string, displayName: string}> => {
  try {
    const studentEmail = testEmail || `student-test-user-${genRandomNumber()}${testEmailDomain}`;
    
    // Set expiration timestamp (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    const userRecord = await createTestUser(studentEmail, userProfile.displayName);

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
      email: studentEmail,
      displayName: "Ipsum Manifest",
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

export const genStudentTestUserWithCompletedProfile = async (testEmail?: string): Promise<{userId: string, email: string, displayName: string, department: string, university: string, phoneNumber: string, level: string}> => {
  try {
    const studentEmail = testEmail || `student-test-user-${genRandomNumber()}${testEmailDomain}`;
    
    // Set expiration timestamp (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    const userRecord = await createTestUser(studentEmail, userProfile.displayName);

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      displayName: userRecord.displayName,
      email: userRecord.email,
      emailVerified: false,
      phoneNumber: userProfile.phoneNumber,
      photoURL: null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      role: userRole,
      expiresAt,
      department: userProfile.department,
      level: userProfile.level,
      university: userProfile.university,
    });

  return {
      userId: userRecord.uid,
      email: studentEmail,
      displayName: userProfile.displayName,
      department: userProfile.department,
      university: userProfile.university,
      phoneNumber: userProfile.phoneNumber,
      level: userProfile.level,
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}