import { db } from "@/config/firebase-admin";
import { genRandomNumber } from "../../genRandomNumber";
import { testData } from "@/tests-utils/data/testData";
import { createTestUser } from "../../functions/createTestUserHelper";
import type { UserRole } from "@/types/user";
import { createProperty } from "@/utils/businessUtils";

const { userProfile } = testData;
const testEmailDomain = "@wptest.com";
const userRole: UserRole = "business";

const businessEmail = `business-test-user-${genRandomNumber()}${testEmailDomain}`;

/**
 * Generates a test user with business role for testing purposes
 * @returns Promise with an object containing the user ID and email
 */
export const genBusinessTestUser = async (
  testEmail?: string
): Promise<{ userId: string; email: string; displayName: string }> => {
  try {
    const businessEmail =
      testEmail || `business-test-user-${genRandomNumber()}${testEmailDomain}`;

    // Set expiration timestamp (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    const userRecord = await createTestUser(
      testEmail || businessEmail,
      userProfile.displayName
    );

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
    console.error("Error creating test user:", error);
    throw error;
  }
};

export const generateBusinessTestUserWithBusinessName = async (
  businessName: string = "Luxury Living"
): Promise<{ userId: string; email: string; business_name: string }> => {
  try {
    const { userId, email } = await genBusinessTestUser();

    const registrationNumber = `REG-${genRandomNumber()}`;
    const businessType = "Hostel";
    const businessAddress = `${genRandomNumber()} Test Street`;
    const city = "Ilorin";
    const state = "Kwara";
    const contactPerson = "John Doe";
    const businessPhone = "+2348012345678";
    const businessWebsite = `https://www.${businessName
      .replace(/\s+/g, "-")
      .toLowerCase()}.com`;
    const businessDescription = `This is a test description for ${businessName}`;
    const foundedYear = "2023";
    const photoURL = "https://randomuser.me/api/portraits/lego/1.jpg";
    const profileComplete = true;

    await db.collection("users").doc(userId).update({
      businessName,
      registrationNumber,
      businessType,
      businessAddress,
      city,
      state,
      contactPerson,
      businessEmail: email,
      businessPhone,
      businessWebsite,
      businessDescription,
      foundedYear,
      photoURL,
      profileComplete,
      updatedAt: new Date()
    });

    return {
      userId: userId,
      email: businessEmail,
      business_name: businessName,
    };
  } catch (error) {
    console.error("Error creating test user with business name:", error);
    throw error;
  }
};

export const genBusinessTestUserWithProperties = async (
  propertyCount: number = 1
): Promise<{
  userId: string;
  email: string;
  displayName: string;
  properties: Array<{ id: string; name: string }>;
}> => {
  try {
    const { userId, email, displayName } = await genBusinessTestUser();
    const properties = [];
    for (let i = 0; i < propertyCount; i++) {
      const property = await createProperty(
        userId,
        i,
        email,
        displayName
      );
      properties.push(property);
    }
    return {
      userId,
      email,
      displayName,
      properties,
    };
  } catch (error) {
    console.error("Error creating test user with properties:", error);
    throw error;
  }
};
