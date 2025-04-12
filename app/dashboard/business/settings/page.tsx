"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import { UserService } from '@/services/user.service';
import { UserProfile } from '@/types/user';
import { useBusinessContext } from '@/context/BusinessContext';

export default function BusinessSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get the business context to update the name globally
  const { updateBusinessName } = useBusinessContext();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const profile = await UserService.getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
            setBusinessName(profile.businessName || '');
            setBusinessDescription(profile.businessDescription || '');
            setBusinessAddress(profile.businessAddress || '');
            setBusinessPhone(profile.businessPhone || '');
            setBusinessEmail(profile.businessEmail || '');
            setBusinessWebsite(profile.businessWebsite || '');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const user = auth.currentUser;
      if (user && userProfile) {
        await UserService.updateUserProfile(user.uid, {
          businessName,
          businessDescription,
          businessAddress,
          businessPhone,
          businessEmail,
          businessWebsite
        });
        
        // Update the business name in the context
        // This will cause the sidebar to update immediately
        updateBusinessName(businessName);
        
        setSuccessMessage('Business settings saved successfully');
      }
    } catch (error) {
      console.error('Error updating business settings:', error);
      setErrorMessage('Failed to save business settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-t-2 border-indigo-600 rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Business Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your business information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your business name"
            />
            <p className="mt-1 text-xs text-gray-500">
              This name will appear in your dashboard and communications
            </p>
          </div>

          <div>
            <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <textarea
              id="businessDescription"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief description of your business"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <input
                type="text"
                id="businessAddress"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your business address"
              />
            </div>

            <div>
              <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Business Phone
              </label>
              <input
                type="tel"
                id="businessPhone"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your business phone"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Business Email
              </label>
              <input
                type="email"
                id="businessEmail"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your business email"
              />
            </div>

            <div>
              <label htmlFor="businessWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                Business Website
              </label>
              <input
                type="url"
                id="businessWebsite"
                value={businessWebsite}
                onChange={(e) => setBusinessWebsite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}