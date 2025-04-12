import { ChangeEvent } from "react";

export type ProfileFormData = {
  displayName: string;
  email: string;
  phoneNumber: string;
  university: string;
  department: string;
  level: string;
  [key: string]: string; // Allow for dynamic properties
};

export type ProfileFormProps = {
  profileForm: ProfileFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleProfileUpdate: (data: ProfileFormData) => Promise<void>;
  saving: boolean;
};

export type ProfileHeaderProps = {
  title: string;
};

export type ProfileImageProps = {
  user: UserProfile | null;
  onPasswordReset: () => Promise<void>;
};

export type ToggleSwitchProps = {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

// If UserProfile is not already defined in types/user.ts, you should import it here
// This is a simplified version, update according to your actual UserProfile definition
import { UserProfile } from "./user";
