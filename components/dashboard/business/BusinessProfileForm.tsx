"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { UserService } from '@/services/user.service';
import { useBusinessContext } from '@/context/BusinessContext';
import { UserProfile } from '@/types/user';

interface BusinessProfileFormProps {
  onComplete: () => void;
  testId?: string;
  isSetup?: boolean;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({ 
  onComplete, 
  testId = "business-profile-form", 
  isSetup = false 
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
          
          // Additional fields - in a real implementation, these would come from the profile too
          setRegistrationNumber(profile.registrationNumber || '');
          setBusinessType(profile.businessType || '');
          setCity(profile.city || '');
          setState(profile.state || '');
          setContactPerson(profile.contactPerson || '');
          setFoundedYear(profile.foundedYear || '');
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
      if (user) {
        // Get the current timestamp as a string for createdAt
        const timestamp = new Date().toISOString();
        
        const updatedProfile: Partial<UserProfile> = {
          ...(userProfile || {}),
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
          profileComplete: true,
          // Only set createdAt if it's a new profile
          ...(!userProfile?.createdAt && { createdAt: timestamp })
        };
        
        await UserService.updateUserProfile(user.uid, updatedProfile);
        
        // Update the business name in the sidebar context
        updateBusinessName(businessName);
        
        setSuccessMessage('Business profile ' + (isSetup ? 'created' : 'updated') + ' successfully');
        
        if (isSetup) {
          // If this is the setup form, call the completion handler after a delay
          setTimeout(() => {
            onComplete();
          }, 1500);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to ' + (isSetup ? 'create' : 'update') + ' profile data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div data-testid={testId} className="space-y-6">
      {isSetup ? (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Business Profile</h1>
          <p className="text-gray-600">
            Complete your business profile to get started. This information will be used to create your account and customize your experience.
          </p>
        </div>
      ) : null}

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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-indigo-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
              <p className="text-sm text-gray-500">
                {isSetup 
                  ? "Enter your business details to get started" 
                  : "Update your business details and profile"}
              </p>
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
                  Business Name*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="block w-full pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                    placeholder="Enter business name"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0010-4.53A5 5 0 0010 11z" clipRule="evenodd" />
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
                  Business Type*
                </label>
                <div className="mt-1 relative">
                  <select
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300"
                    required
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
                  Business Address*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                    placeholder="Enter full address"
                    required
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
                  Contact Person*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="contactPerson"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                    placeholder="e.g. Lagos"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                    placeholder="e.g. Lagos State"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700">
                  Business Phone*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="tel"
                    id="businessPhone"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                    placeholder="+234 800 000 0000"
                    required
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
                  Business Email*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="email"
                    id="businessEmail"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                    placeholder="email@example.com"
                    required
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
                Business Description*
              </label>
              <div className="mt-1">
                <textarea
                  id="businessDescription"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  rows={6}
                  className="block w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 pl-3 py-2 text-sm"
                  placeholder="Tell students about your business, accommodations, and services..."
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  This description will be displayed on your public profile and property listings.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            {!isSetup && (
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            )}
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
                  {isSetup ? 'Creating Profile...' : 'Saving Changes...'}
                </div>
              ) : (
                isSetup ? 'Complete Setup' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfileForm;