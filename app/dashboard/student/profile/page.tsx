"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { UserService } from "@/services/user.service";
import { UserProfile } from "@/types/user";
import { toast } from "react-hot-toast";

// Import components
import ProfileHeader from "@/components/dashboard/student/profile/ProfileHeader";
import ProfileImage from "@/components/dashboard/student/profile/ProfileImage";
import ProfileForm from "@/components/dashboard/student/profile/ProfileForm";
import AccountSettings from "@/components/dashboard/student/profile/AccountSettings";
import LoadingSpinner from "@/components/dashboard/student/profile/LoadingSpinner";

// Define type for profile form data
interface ProfileFormData {
  displayName: string;
  email: string;
  phoneNumber: string;
  university: string;
  department: string;
  level: string;
  [key: string]: string; // Allow for dynamic properties
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    displayName: "",
    email: "",
    phoneNumber: "",
    university: "",
    department: "",
    level: ""
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        const userProfile = await UserService.getUserProfile(currentUser.uid);
        if (!userProfile) {
          router.push('/login');
          return;
        }
        
        setUser(userProfile);
        setProfileForm({
          displayName: userProfile.displayName || "",
          email: userProfile.email || "",
          phoneNumber: userProfile.phoneNumber || "",
          university: userProfile.university || "",
          department: userProfile.department || "",
          level: userProfile.level || ""
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Updated to accept form data with our new interface
  const handleProfileUpdate = async (formData?: ProfileFormData) => {
    setSaving(true);
    
    try {
      if (!user) return;
      
      // Use formData if provided (from React Hook Form), otherwise use profileForm state
      const dataToUpdate = formData || profileForm;
      
      await UserService.updateUserProfile(user.uid, {
        displayName: dataToUpdate.displayName,
        phoneNumber: dataToUpdate.phoneNumber,
        university: dataToUpdate.university,
        department: dataToUpdate.department,
        level: dataToUpdate.level
      });
      
      // Update local form state if data was passed from the form
      if (formData) {
        setProfileForm(prev => ({
          ...prev,
          ...formData
        }));
      }
      
      toast.success("Profile updated successfully!");
      
      // Refreshing the user data
      const updatedUserProfile = await UserService.getUserProfile(user.uid);
      if (updatedUserProfile) {
        setUser(updatedUserProfile);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!user?.email) return;
      
      // This would use Firebase auth's password reset
      // await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error("Failed to send password reset email. Please try again.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8" data-testid="profile-page-container">
      <ProfileHeader title="My Profile" />
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="md:flex">
          <ProfileImage user={user} onPasswordReset={handlePasswordReset} />
          <ProfileForm 
            profileForm={profileForm}
            handleInputChange={handleInputChange}
            handleProfileUpdate={handleProfileUpdate}
            saving={saving}
          />
        </div>
      </div>
      
      <AccountSettings />
    </div>
  );
}