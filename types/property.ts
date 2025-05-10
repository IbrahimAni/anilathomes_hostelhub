/**
 * Types for property data in the HostelHub application
 */

// Location structure for properties
export interface IPropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
}

// Contact information for properties
export interface IPropertyContact {
  email: string;
  phone: string;
}

// Geolocation data for map display
export interface IPropertyGeolocation {
  latitude: number;
  longitude: number;
}

// Base property data structure
export interface IPropertyBase {
  name: string;
  description: string;
  location: IPropertyLocation;
  pricePerYear: number;
  roomTypes: string[];
  availableRooms: number;
  amenities: string[];
  contact: IPropertyContact;
  rules?: string;
  geolocation?: IPropertyGeolocation;
}

// Property with optional fields for creation/updates
export interface IPropertyInput extends IPropertyBase {
  images?: string[]; // Paths to local images
  imageUrls?: string[]; // Already uploaded image URLs
}

// Property as stored in the database and returned by API
export interface IProperty {
  id: string;
  name: string;
  description: string;
  location: string;
  locationDetails: IPropertyLocation;
  pricePerYear: number;
  price: string;
  roomTypes: string[];
  availableRooms: number;
  amenities: string[];
  contact: IPropertyContact;
  businessId: string;
  createdAt: Date;
  rating: number;
  reviewCount: number;
  imageUrls: string[];
  rules?: string;
  geolocation?: IPropertyGeolocation;
  [key: string]: any; // For any additional properties
}

// Business with property result for testing
export interface IBusinessWithProperty {
  userId: string;
  email: string;
  business_name?: string;
  propertyId: string;
  property: IProperty;
}
