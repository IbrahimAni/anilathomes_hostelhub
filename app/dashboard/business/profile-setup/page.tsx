"use client";

import React from 'react';
import BusinessProfileForm from '@/components/dashboard/business/BusinessProfileForm';

const ProfileSetupPage = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <BusinessProfileForm 
          onComplete={() => {
            // In a real app, this would redirect to the dashboard after saving the profile
            window.location.href = '/dashboard/business';
          }}
          testId="business-profile-setup"
        />
      </div>
    </div>
  );
};

export default ProfileSetupPage;