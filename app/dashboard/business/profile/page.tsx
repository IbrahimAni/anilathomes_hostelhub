"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { UserService } from "@/services/user.service";
import { useBusinessContext } from "@/context/BusinessContext";
import { UserProfile } from "@/types/user";
import Image from "next/image";
import ConfirmationModal from "@/components/common/ConfirmationModal";

export default function BusinessProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { updateBusinessName } = useBusinessContext();
  const router = useRouter();

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  
  // Advanced settings toggles
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [allowAgentReferrals, setAllowAgentReferrals] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        const profile = await UserService.getUserProfile(currentUser.uid);
        setUserProfile(profile);

        if (profile) {
          // Load profile data into form state
          setBusinessName(profile.businessName || '');
          setBusinessDescription(profile.businessDescription || '');
          setBusinessAddress(profile.businessAddress || '');
          setBusinessPhone(profile.businessPhone || '');
          setBusinessEmail(profile.businessEmail || '');
          setBusinessWebsite(profile.businessWebsite || '');
          
          // Additional fields from profile
          setRegistrationNumber(profile.registrationNumber || 'BN-1234567');
          setBusinessType(profile.businessType || 'Hostel/Accommodation');
          setCity(profile.city || 'Lagos');
          setState(profile.state || 'Lagos State');
          setContactPerson(profile.contactPerson || 'John Doe');
          setFoundedYear(profile.foundedYear || '2020');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const user = auth.currentUser;
      if (user && userProfile) {
        const updatedProfile: Partial<UserProfile> = {
          ...userProfile,
          businessName,
          businessDescription,
          businessAddress,
          businessPhone,
          businessEmail,
          businessWebsite,
          registrationNumber,
          businessType,
          city,
          state,
          contactPerson,
          foundedYear,
          profileComplete: true
        };
        
        await UserService.updateUserProfile(user.uid, updatedProfile);
        
        // Update the business name in the sidebar context
        updateBusinessName(businessName);
        
        setSuccessMessage('Business profile updated successfully');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile data');
    } finally {
      setSaving(false);
    }
  };

  // Handle profile reset confirmation
  const handleResetProfile = () => {
    router.push('/dashboard/business/profile-setup');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div data-testid="business-profile-page">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Profile</h1>
          <p className="text-gray-600">Manage your business information, settings, and preferences.</p>
        </div>
        <button
          onClick={() => setIsResetModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Reset Profile
        </button>
      </div>

      {/* Confirmation Modal for Profile Reset */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetProfile}
        title="Reset Business Profile?"
        message="Are you sure you want to reset your business profile? This will take you to the profile setup page where you can set up your profile from scratch. Your existing data will be preserved until you submit the new profile."
        confirmButtonText="Yes, Reset Profile"
        cancelButtonText="Cancel"
        confirmButtonColor="red"
      />

      {successMessage && (
        <div className="bg-green-50 rounded-lg p-4 mb-6 flex items-center shadow-sm border border-green-200" role="alert">
          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
          <button 
            onClick={() => setSuccessMessage('')} 
            className="ml-auto bg-green-50 text-green-500 rounded-full p-1 hover:bg-green-100 focus:outline-none"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 rounded-lg p-4 mb-6 flex items-center shadow-sm border border-red-200" role="alert">
          <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage('')} 
            className="ml-auto bg-red-50 text-red-500 rounded-full p-1 hover:bg-red-100 focus:outline-none"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Profile Summary and Form - Remaining code unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <div className="flex justify-center">
                <div className="relative rounded-full border-4 border-white h-24 w-24 overflow-hidden bg-white">
                  <Image 
                    src={userProfile?.photoURL || "https://via.placeholder.com/150"} 
                    alt="Business Logo" 
                    width={150} 
                    height={150}
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-center text-white">
                {businessName || "Your Business"}
              </h3>
              <p className="text-indigo-100 text-center text-sm">{businessType || "Hospitality"}</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                  <p className="text-sm text-gray-800">{businessEmail || userProfile?.email || "email@example.com"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                  <p className="text-sm text-gray-800">{businessPhone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                  <p className="text-sm text-gray-800">{city && state ? `${city}, ${state}` : "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Member Since</p>
                  <p className="text-sm text-gray-800">{new Date(userProfile?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  className="w-full flex items-center justify-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Change Photo
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Settings Card */}
          <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Quick Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Manage key preferences</p>
            </div>
            <div className="p-6 space-y-5">
              {/* Toggle Switches with Modern UI */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={receiveNotifications} onChange={(e) => setReceiveNotifications(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Public Profile</p>
                  <p className="text-xs text-gray-500">Visible in search results</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Agent Referrals</p>
                  <p className="text-xs text-gray-500">Allow agents to refer students</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={allowAgentReferrals} onChange={(e) => setAllowAgentReferrals(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-indigo-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                  <p className="text-sm text-gray-500">Update your business details and profile</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Tabs for form sections */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6">
                  <a href="#basic-info" className="border-indigo-500 text-indigo-600 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
                    Basic Info
                  </a>
                  <a href="#contact-info" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
                    Contact Details
                  </a>
                  <a href="#description" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
                    Description
                  </a>
                </nav>
              </div>

              {/* Basic Information Section */}
              <div id="basic-info" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="businessName"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="block w-full pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="Enter business name"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0010-4.53A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="registrationNumber"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        className="block w-full pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="e.g. BN1234567"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="businessType"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300"
                      >
                        <option value="">Select business type</option>
                        <option value="Hostel/Accommodation">Hostel/Accommodation</option>
                        <option value="Guest House">Guest House</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                      Year Founded
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="foundedYear"
                        value={foundedYear}
                        onChange={(e) => setFoundedYear(e.target.value)}
                        className="block w-full pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="e.g. 2020"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div id="contact-info" className="pt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
                      Business Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="businessAddress"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="Enter full address"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                      Contact Person
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="contactPerson"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="Full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="e.g. Lagos"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="e.g. Lagos State"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700">
                      Business Phone
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="tel"
                        id="businessPhone"
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                        className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="+234 800 000 0000"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700">
                      Business Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="email"
                        id="businessEmail"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="email@example.com"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessWebsite" className="block text-sm font-medium text-gray-700">
                      Business Website
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="url"
                        id="businessWebsite"
                        value={businessWebsite}
                        onChange={(e) => setBusinessWebsite(e.target.value)}
                        className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                        placeholder="https://example.com"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Description Section */}
              <div id="description" className="pt-6 space-y-6">
                <div>
                  <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
                    Business Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="businessDescription"
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      rows={6}
                      className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                      placeholder="Tell students about your business, accommodations, and services..."
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      This description will be displayed on your public profile and property listings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}