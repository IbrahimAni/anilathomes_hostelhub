"use client";

import React from 'react';
import BusinessProfileForm from '@/components/dashboard/business/BusinessProfileForm';
import { useRouter } from 'next/navigation';

const ProfileSetupPage = () => {
  const router = useRouter();
  
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <BusinessProfileForm 
          onComplete={() => {
            // Navigate to the dashboard after setup is complete
            router.push('/dashboard/business');
          }}
          testId="business-profile-setup"
          isSetup={true}
        />
      </div>
    </div>
  );
};

export default ProfileSetupPage;