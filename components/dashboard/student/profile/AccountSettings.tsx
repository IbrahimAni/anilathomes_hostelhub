import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const AccountSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive emails for bookings, payments and promotions</p>
          </div>
          <div className="toggle-switch" data-testid="toggle-email-notifications">
            <ToggleSwitch defaultChecked={true} />
          </div>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button 
            className="text-blue-500 hover:underline" 
            data-testid="btn-enable-2fa"
          >
            Enable
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-red-600">Delete Account</h4>
            <p className="text-sm text-gray-600">Permanently delete your account and all your data</p>
          </div>
          <button 
            className="text-red-500 hover:underline" 
            data-testid="btn-delete-account"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
