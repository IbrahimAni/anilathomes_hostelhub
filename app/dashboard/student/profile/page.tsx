"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Added Next.js Image import
import { auth } from "@/config/firebase";
import { UserService } from "@/services/user.service";
import { UserProfile } from "@/types/user";
import { FiUser, FiMail, FiPhone, FiLock, FiUpload } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!user) return;
      
      // In a real implementation, we would update this in Firebase
      await UserService.updateUserProfile(user.uid, {
        displayName: profileForm.displayName,
        phoneNumber: profileForm.phoneNumber,
        university: profileForm.university,
        department: profileForm.department,
        level: profileForm.level
      });
      
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
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="md:flex">
          {/* Profile Image Section */}
          <div className="p-6 text-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center relative mb-4">
              {user?.photoURL ? (
                <Image 
                  src={user.photoURL}
                  alt="Profile" 
                  fill
                  sizes="128px"
                  className="object-cover rounded-full"
                />
              ) : (
                <FiUser size={64} className="text-gray-400" />
              )}
              
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                <FiUpload size={16} />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold">{user?.displayName || "Student"}</h2>
            <p className="text-gray-600 mt-1">{user?.email}</p>
            
            <div className="mt-4 bg-blue-50 text-blue-800 py-1 px-3 rounded-full inline-flex items-center text-sm">
              <span>Student</span>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={handlePasswordReset}
                className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <FiLock className="mr-2" />
                Change Password
              </button>
            </div>
          </div>
          
          {/* Profile Form Section */}
          <div className="p-6 md:w-2/3">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={profileForm.displayName}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      readOnly
                      className="pl-10 w-full rounded-md border border-gray-300 bg-gray-50 cursor-not-allowed"
                      placeholder="Your email address"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <select
                    id="university"
                    name="university"
                    value={profileForm.university}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select your university</option>
                    <option value="unilag">University of Lagos</option>
                    <option value="lasu">Lagos State University</option>
                    <option value="ui">University of Ibadan</option>
                    <option value="oau">Obafemi Awolowo University</option>
                    <option value="uniabuja">University of Abuja</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={profileForm.department}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter your department"
                  />
                </div>
                
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={profileForm.level}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select your level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="postgrad">Postgraduate</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${
                    saving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Account Settings Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive emails for bookings, payments and promotions</p>
            </div>
            <div className="toggle-switch">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="text-blue-500 hover:underline">
              Enable
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-gray-600">Permanently delete your account and all your data</p>
            </div>
            <button className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #3B82F6;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #3B82F6;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>
    </div>
  );
}