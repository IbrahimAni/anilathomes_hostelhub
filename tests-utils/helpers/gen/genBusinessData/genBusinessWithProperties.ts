import { db, storage } from "@/config/firebase-admin";
import { genBusinessTestUser as businessAccountWithoutBusinessName } from "@/tests-utils/helpers/gen/generateTestUserData/businessUserData";
import { generateBusinessTestUserWithBusinessName as businessAccountWithBusinessName } from "@/tests-utils/helpers/gen/generateTestUserData/businessUserData";
import {
  IProperty,
  IPropertyInput,
  IBusinessWithProperty,
} from "@/types/property";
import path from "path";

const defaultTestProperty: IPropertyInput = {
  name: "High End Hostel",
  description: "A cozy hostel for students",
  location: {
    address: "123 high way Street",
    city: "Malete",
    state: "Kwara",
    country: "Nigeria",
  },
  pricePerYear: 200000,
  roomTypes: ["Single", "Double"],
  availableRooms: 10,
  amenities: ["Wi-Fi", "Security", "Water Supply"],
  contact: {
    email: "test@example.com",
    phone: "1234567890",
  },
};

/**
 * To create a business with properties, we first create a business user and then add properties to that user.
 * This function creates a business user and adds properties to it.
 * @param businessName Optional business name
 * @param properties Optional array of property data to create. If not provided, creates one default test property
 */
export const genBusinessWithProperties = async (
  businessName?: string,
  properties: Partial<IPropertyInput>[] = [{}]
) => {
  let userId: string;
  let email: string;
  let business_name: string | undefined;

  // Create a business account
  if (businessName) {
    const result = await businessAccountWithBusinessName(businessName);
    userId = result.userId;
    email = result.email;
    business_name = result.business_name;
  } else {
    const result = await businessAccountWithoutBusinessName();
    userId = result.userId;
    email = result.email;
    business_name = undefined;
  }

  // Add properties for the business
  const propertyIds = [];
  const hostelsCollection = db.collection("hostels");
  const bucket = storage.bucket();

  for (const propertyData of properties) {
    // Upload images if provided
    const imageUrls = [];
    if (propertyData.images?.length) {
      for (const imagePath of propertyData.images) {
        try {
          // Create a unique filename
          const uniqueFilename = `${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 15)}_${path.basename(imagePath)}`;
          const destination = `hostels/${userId}/${uniqueFilename}`;

          // Upload the file
          await bucket.upload(imagePath, {
            destination,
            metadata: {
              contentType: "image/jpeg", // Adjust if needed
              metadata: {
                "uploaded-by": userId,
              },
            },
          });

          // Get the public URL
          const [url] = await bucket.file(destination).getSignedUrl({
            action: "read",
            expires: "01-01-2100", // Far future expiry for test data
          });

          imageUrls.push(url);
        } catch (error) {
          console.error("Error uploading test image:", error);
        }
      }
    }

    const property = {
      ...defaultTestProperty,
      ...propertyData,
      businessId: userId,
      createdAt: new Date(),
      rating: 0,
      reviewCount: 0,
      // Format the location string as it's done in the BusinessService
      location: `${
        propertyData.location?.address || defaultTestProperty.location.address
      }, ${propertyData.location?.city || defaultTestProperty.location.city}, ${
        propertyData.location?.state || defaultTestProperty.location.state
      }`,
      locationDetails: propertyData.location || defaultTestProperty.location,
      // Format price string
      price: `₦${(
        propertyData.pricePerYear || defaultTestProperty.pricePerYear
      ).toLocaleString()}/year`,
      // Add uploaded image URLs
      imageUrls: [...imageUrls, ...(propertyData.imageUrls || [])],
    };
    const docRef = await hostelsCollection.add(property);
    propertyIds.push(docRef.id);
  }
  return {
    userId,
    email,
    business_name,
    propertyIds,
  };
};

/**
 * Creates a business with a single property and returns all details.
 * This function is a simplified version of genBusinessWithProperties that
 * returns the complete property details along with business information.
 *
 * @param businessName Optional business name
 * @param propertyData Optional property data to customize the property
 * @returns Business data including the complete property object
 */
export const genBusinessWithProperty = async (
  businessName?: string,
  propertyData: Partial<IPropertyInput> = {}
): Promise<IBusinessWithProperty> => {
  let userId: string;
  let email: string;
  let business_name: string | undefined;

  // Create a business account
  if (businessName) {
    const result = await businessAccountWithBusinessName(businessName);
    userId = result.userId;
    email = result.email;
    business_name = result.business_name;
  } else {
    const result = await businessAccountWithoutBusinessName();
    userId = result.userId;
    email = result.email;
    business_name = undefined;
  }

  // Add one property for the business
  const hostelsCollection = db.collection("hostels");
  const bucket = storage.bucket();

  // Upload images if provided
  const imageUrls = [];
  if (propertyData.images?.length) {
    for (const imagePath of propertyData.images) {
      try {
        // Create a unique filename
        const uniqueFilename = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}_${path.basename(imagePath)}`;
        const destination = `hostels/${userId}/${uniqueFilename}`;

        // Upload the file
        await bucket.upload(imagePath, {
          destination,
          metadata: {
            contentType: "image/jpeg", // Adjust if needed
            metadata: {
              "uploaded-by": userId,
            },
          },
        });

        // Get the public URL
        const [url] = await bucket.file(destination).getSignedUrl({
          action: "read",
          expires: "01-01-2026",
        });

        imageUrls.push(url);
      } catch (error) {
        console.error("Error uploading test image:", error);
      }
    }
  }

  const property = {
    ...defaultTestProperty,
    ...propertyData,
    businessId: userId,
    createdAt: new Date(),
    rating: 0,
    reviewCount: 0,
    // Format the location string as it's done in the BusinessService
    location: `${
      propertyData.location?.address || defaultTestProperty.location.address
    }, ${propertyData.location?.city || defaultTestProperty.location.city}, ${
      propertyData.location?.state || defaultTestProperty.location.state
    }`,
    locationDetails: propertyData.location || defaultTestProperty.location,
    // Format price string
    price: `₦${(
      propertyData.pricePerYear || defaultTestProperty.pricePerYear
    ).toLocaleString()}/year`,
    // Add uploaded image URLs
    imageUrls: [...imageUrls, ...(propertyData.imageUrls || [])],
  };

  const docRef = await hostelsCollection.add(property);
  const propertyId = docRef.id;

  // Return both business and complete property details
  return {
    userId,
    email,
    business_name,
    propertyId,
    property: {
      id: propertyId,
      ...property,
      name: propertyData.name || defaultTestProperty.name,
    },
  };
};

// Need to create a function to generate a business with property and agent
//returnType should be the details of the agent
export const genBusinessWithPropertyAndAgent = async () => {};

// Need to create business with agent and no property
//returnType should be the details of the agent
export const genBusinessWithAgent = async () => {};
