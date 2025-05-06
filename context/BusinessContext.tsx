"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/config/firebase';
import { UserService } from '@/services/user.service';

interface BusinessContextType {
  businessName: string;
  updateBusinessName: (name: string) => void;
  isDefaultName: boolean;
}

const defaultContextValue: BusinessContextType = {
  businessName: '',
  updateBusinessName: () => {},
  isDefaultName: true,
};

const BusinessContext = createContext<BusinessContextType>(defaultContextValue);

export const useBusinessContext = () => useContext(BusinessContext);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [businessName, setBusinessName] = useState<string>('');
  const [isDefaultName, setIsDefaultName] = useState<boolean>(true);

  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userProfile = await UserService.getUserProfile(user.uid);
          if (userProfile && userProfile.businessName) {
            setBusinessName(userProfile.businessName);
            setIsDefaultName(false);
          } else {
            setBusinessName('Business Name');
            setIsDefaultName(true);
          }
        }
      } catch (error) {
        console.error('Error fetching business name:', error);
      }
    };

    fetchBusinessName();
  }, []);

  const updateBusinessName = (name: string) => {
    setBusinessName(name);
    setIsDefaultName(name === '' || name === 'My Business');
  };

  return (
    <BusinessContext.Provider value={{ businessName, updateBusinessName, isDefaultName }}>
      {children}
    </BusinessContext.Provider>
  );
};