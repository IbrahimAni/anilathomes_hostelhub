import React from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { ProfileFormProps } from '@/types/profile';

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  profileForm, 
  handleInputChange, 
  handleProfileUpdate, 
  saving 
}) => {
  return (
    <div className="p-6 md:w-2/3">
      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
      
      <form onSubmit={handleProfileUpdate} className="space-y-6" data-testid="profile-update-form">
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
                data-testid="input-displayName"
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
                data-testid="input-email"
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
                data-testid="input-phoneNumber"
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
              data-testid="select-university"
              className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select your university</option>
              <option value="unilag">University of Lagos</option>
              <option value="kwasu">Kwara State University</option>
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
              data-testid="input-department"
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
              data-testid="select-level"
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
            data-testid="btn-save-profile"
            className={`px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
