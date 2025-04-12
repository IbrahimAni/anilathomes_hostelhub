import React from 'react';
import { ProfileHeaderProps } from '@/types/profile';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-3xl font-bold">{title}</h1>
  );
};

export default ProfileHeader;
