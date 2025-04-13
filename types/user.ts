import { User as FirebaseUser } from "firebase/auth";

export type UserRole = "student" | "agent" | "business";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  // Added student-specific fields
  university?: string;
  department?: string;
  level?: string;
  // Added business-specific fields
  businessName?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessWebsite?: string;
  // Added business settings fields
  defaultCommissionRate?: number;
  enableEmailNotifications?: boolean;
  enableSmsNotifications?: boolean;
  autoApproveBookings?: boolean;
  paymentReminders?: boolean;
  defaultCurrency?: string;
  taxRate?: number;
}

// Extended user interface for app usage
export interface User extends Omit<FirebaseUser, "providerData"> {
  role: UserRole | null;
  profileComplete: boolean;
}

export const DEFAULT_USER_ROLE: UserRole = "student";