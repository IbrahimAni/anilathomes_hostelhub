"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { UserRole } from '@/types/user';
import { UserService } from '@/services/user.service';

const SelectUserRole = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as loading to prevent flash
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated and has a role already
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }

      try {
        // Check if user already has a role in Firestore
        const userProfile = await UserService.getUserProfile(user.uid);
        
        if (userProfile && userProfile.role) {
          // User already has a role in Firestore, redirect to their dashboard
          router.push(`/dashboard/${userProfile.role.toLowerCase()}`);
          return;
        }
        
        // Fall back to checking Firebase Auth profile if no Firestore data
        if (user.displayName && ['student', 'agent', 'business'].includes(user.displayName.toLowerCase())) {
          // User has a role in Auth but not in Firestore - sync them
          if (user.displayName) {
            await UserService.updateUserRole(user.uid, user.displayName.toLowerCase() as UserRole);
          }
          router.push(`/dashboard/${user.displayName.toLowerCase()}`);
          return;
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        setError('Error checking your profile. Please try again.');
      } finally {
        // User is logged in but doesn't have a role
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleRoleSelection = async (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("You must be logged in to select a role");
      }
      
      // Update user profile in Firebase Auth
      await updateProfile(user, {
        // Store the role in the displayName field
        displayName: role
      });
      
      // Store the role in Firestore as well
      await UserService.updateUserRole(user.uid, role);
      
      // Redirect based on role
      router.push(`/dashboard/${role.toLowerCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set user role");
      setIsLoading(false);
    }
  };

  const roles: {
    id: UserRole;
    label: string;
    icon: string;
    description: string;
  }[] = [
    { id: 'student', label: 'Student', icon: '👨‍🎓', description: 'Looking for student accommodation' },
    { id: 'agent', label: 'Agent', icon: '🏢', description: 'Managing properties and listings' },
    { id: 'business', label: 'Business', icon: '💼', description: 'Offering services to students' }
  ];

  // Show loading state while checking auth
  if (isLoading && !selectedRole) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" data-testid="select-role-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Select your role
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you'll use HostelHub
        </p>
        <p className="mt-1 text-center text-xs text-red-600 font-semibold">
          You cannot change your role after selection
        </p>
      </div>

      {error && (
        <div className="mb-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-0">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelection(role.id)}
            disabled={isLoading}
            className={`w-full sm:w-64 p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow 
              ${selectedRole === role.id ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-200'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            data-testid={`role-${role.id}`}
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">{role.icon}</div>
              <div className="text-lg font-medium text-gray-900">{role.label}</div>
              <div className="mt-2 text-sm text-gray-500 text-center">{role.description}</div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
};

export default SelectUserRole;