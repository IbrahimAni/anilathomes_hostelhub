import React from 'react';
import Image from 'next/image';
import { FiUser, FiUpload, FiLock } from 'react-icons/fi';
import { ProfileImageProps } from '@/types/profile';

const ProfileImage: React.FC<ProfileImageProps> = ({ user, onPasswordReset }) => {
  return (
    <div className="p-6 text-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200">
      <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center relative mb-4">
        {user?.photoURL ? (
          <Image 
            src={user.photoURL}
            alt="Profile" 
            fill
            sizes="128px"
            className="object-cover rounded-full"
            data-testid="profile-image"
          />
        ) : (
          <FiUser size={64} className="text-gray-400" data-testid="profile-icon" />
        )}
        
        <button 
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          data-testid="btn-upload-photo"
        >
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
          onClick={onPasswordReset}
          data-testid="btn-change-password"
          className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <FiLock className="mr-2" />
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfileImage;
