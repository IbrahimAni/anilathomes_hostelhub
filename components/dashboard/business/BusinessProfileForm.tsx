"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessProfileData } from '@/types/business';

interface BusinessProfileFormProps {
  onComplete?: () => void;
  testId?: string;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({ onComplete, testId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessProfileData>({
    businessName: '',
    registrationNumber: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    foundedYear: '',
    logoUrl: '',
    acceptedTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically save the data to your backend/Firebase
    console.log('Business profile data:', formData);
    
    // Notify parent component or redirect
    if (onComplete) {
      onComplete();
    } else {
      router.push('/dashboard/business');
    }
  };

  // Nigerian states for dropdown
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 
    'Taraba', 'Yobe', 'Zamfara'
  ];

  return (
    <div 
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      data-testid={testId || "business-profile-form"}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Business Profile</h1>
        <p className="text-gray-600">Please provide your business details to set up your account.</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
                aria-current={currentStep === step ? 'step' : undefined}
              >
                {step}
              </div>
              {step < 3 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div>Business Details</div>
          <div>Contact Information</div>
          <div>Additional Information</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-4" data-testid="step-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="business-name-input"
                />
              </div>
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number (CAC) *
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  required
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="reg-number-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                Business Type *
              </label>
              <select
                id="businessType"
                name="businessType"
                required
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="business-type-select"
              >
                <option value="">Select business type</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="limited_liability">Limited Liability Company</option>
                <option value="corporation">Corporation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Business Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="address-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="city-input"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="state-select"
                >
                  <option value="">Select a state</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4" data-testid="step-2">
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person Name *
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="contact-person-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="email-input"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 08012345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="phone-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Business Website (Optional)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="website-input"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4" data-testid="step-3">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Business Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="description-input"
              ></textarea>
            </div>

            <div>
              <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-1">
                Year Founded
              </label>
              <input
                type="number"
                id="foundedYear"
                name="foundedYear"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.foundedYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="founded-year-input"
              />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="logo-url-input"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptedTerms"
                    name="acceptedTerms"
                    type="checkbox"
                    required
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    data-testid="terms-checkbox"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptedTerms" className="font-medium text-gray-700">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="py-2 px-4 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              data-testid="prev-button"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              data-testid="next-button"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              data-testid="submit-button"
            >
              Complete Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BusinessProfileForm;