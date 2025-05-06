import { db } from "@/config/firebase-admin";
import { testData } from "@/tests-utils/data/testData";
import { createTestUser } from "@/tests-utils/helpers/functions/createTestUserHelper";
import { genRandomNumber } from "@/tests-utils/helpers/genRandomNumber";
import type { UserRole } from "@/types/user";

const cities = ["Malete", "Ilorin"];
const hostelNames = [
  "Sunshine Hostel",
  "Green Valley Hostel",
  "Blue Lagoon Hostel",
  "Golden Gate Hostel",
  "Silver Sands Hostel",
  "Crystal Palace Hostel",
  "Emerald City Hostel",
  "Rainbow Heights Hostel",
  "Starry Night Hostel",
  "Dreamland Hostel",
];
const businessNames = [
  "Comfort Suites",
  "Luxury Living",
  "Elite Estates",
  "Serene Spaces",
  "Tranquil Retreats",
];

/**
 * Adds a property to the business user's profile in Firestore
 * @param business_id - The ID of the business to which the property will be added ( This is also the user_id of the user)
 * @returns Promise that resolves when the property is added
 */
export const addPropertyToBusiness = async (
  business_id: string
): Promise<void> => {};

/**
 * Creates a property document in Firestore and returns minimal data
 */
export async function createProperty(
  businessId: string,
  index: number = 1,
  email: string = genTestEmail(),
  displayName: string
): Promise<{ id: string; name: string }> {
  const propertyId = `property-${businessId}-${index}-${Date.now()}`;
  const timestamp = Date.now();
  const imageUrls = [
    `https://firebasestorage.googleapis.com/v0/b/anilathomes-hostelhub.appspot.com/o/hostels%2F${businessId}%2F${timestamp}_image1.jpg?alt=media&token=test-token-${index}-1`,
    `https://firebasestorage.googleapis.com/v0/b/anilathomes-hostelhub.appspot.com/o/hostels%2F${businessId}%2F${timestamp}_image2.jpg?alt=media&token=test-token-${index}-2`,
  ];

  const locationDetails = {
    address: `${index + 1} Test Street`,
    city: cities[Math.floor(Math.random() * cities.length)],
    state: "Kwara",
    country: "Nigeria",
  };
  const location = `${locationDetails.address}, ${locationDetails.city}, ${locationDetails.state}`;
  const pricePerYear = 150000 + index * 10000;
  const price = `₦${pricePerYear.toLocaleString()}/year`;
  const name = hostelNames[Math.floor(Math.random() * hostelNames.length)];
  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
  await db
    .collection("hostels")
    .doc(propertyId)
    .set({
      id: propertyId,
      businessId,
      agentIds: [],
      geolocation: { latitude: 0, longitude: 0 },
      name,
      description,
      location,
      locationDetails,
      imageUrls,
      imageUrl: imageUrls[0],
      images: imageUrls,
      pricePerYear,
      price,
      roomTypes: ["Single", "Double"],
      availableRooms: 10 + index,
      amenities: ["Wi-Fi", "Security", "Water Supply"],
      contact: { email, phone: "+2348012345678" },
      rules: "No smoking. No loud music after 10pm.",
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      reviewCount: 0,
    });

  return { id: propertyId, name };
}

export const genTestEmail = (domain: string = "wptest.com"): string => {
  const randomNumber = genRandomNumber();
  return `testuser${randomNumber}@${domain}`;
};
