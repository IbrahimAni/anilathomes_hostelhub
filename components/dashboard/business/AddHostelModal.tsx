"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BusinessService } from '@/services';
import Image from 'next/image';

interface HostelLocation {
  address: string;
  city: string;
  state: string;
  country: string;
}

interface HostelContact {
  email: string;
  phone: string;
}

interface HostelFormData {
  name: string;
  description: string;
  location: HostelLocation;
  images: File[];
  imageUrls: string[]; // To store uploaded image URLs
  pricePerYear: number;
  roomTypes: string[];
  availableRooms: number;
  amenities: string[];
  contact: HostelContact;
  rules: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

interface AddHostelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHostelAdded: () => void;
}

const initialFormData: HostelFormData = {
  name: '',
  description: '',
  location: {
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
  },
  images: [],
  imageUrls: [],
  pricePerYear: 0,
  roomTypes: ['Single'],
  availableRooms: 0,
  amenities: [],
  contact: {
    email: '',
    phone: '',
  },
  rules: '',
  geolocation: {
    latitude: 0,
    longitude: 0
  }
};

const commonAmenities = [
  "Wi-Fi", "Security", "Water Supply", "Electricity", "Bathroom", 
  "Kitchen", "Laundry", "Study Room", "TV Room", "Cafeteria", 
  "Parking", "Generator", "Air Conditioning"
];

const roomTypeOptions = ["Single", "Double", "Triple", "Quad", "Dormitory", "En-suite", "Studio"];

export default function AddHostelModal({ isOpen, onClose, onHostelAdded }: AddHostelModalProps) {
  const [formData, setFormData] = useState<HostelFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof HostelFormData | 'submit', string>>>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset to first step when modal opens
      setCurrentStep(1);
      // Reset form data to prevent previous data from persisting
      setFormData(initialFormData);
      // Clear any previous errors
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'geolocation') {
        // Special handling for geolocation fields
        setFormData(prev => ({
          ...prev,
          geolocation: {
            ...(prev.geolocation || { latitude: 0, longitude: 0 }),
            [child]: value === '' ? '' : (child === 'latitude' || child === 'longitude' ? Number(value) : value)
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...((prev[parent as keyof typeof prev] as object) || {}),
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  // Helper function to get image preview URLs
  const getImagePreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Update handleImageChange to better process files and save them
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Check if adding these files would exceed the 10 image limit
      if (formData.images.length + newFiles.length > 10) {
        setErrors({ 
          ...errors, 
          images: 'Maximum 10 images allowed' 
        });
        return;
      }
      
      // Create object URLs for each file
      const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imageUrls: [...prev.imageUrls, ...newImageUrls]
      }));
      
      // Clear any previous errors
      if (errors.images) {
        setErrors({ ...errors, images: undefined });
      }
    }
  };

  // Updated removeImage to clean up object URLs
  const removeImage = (index: number) => {
    // Get the URL to revoke
    const urlToRevoke = formData.imageUrls[index];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }
    
    const newImages = [...formData.images];
    const newImageUrls = [...formData.imageUrls];
    
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
      imageUrls: newImageUrls
    }));
  };


  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    
    setFormData(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  const handleRoomTypeToggle = (type: string) => {
    const newRoomTypes = formData.roomTypes.includes(type)
      ? formData.roomTypes.filter(t => t !== type)
      : [...formData.roomTypes, type];
    
    setFormData(prev => ({
      ...prev,
      roomTypes: newRoomTypes
    }));
  };

  // Update the validateForm function to not trigger submission on review step
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HostelFormData, string>> = {};
    
    // Step 1 validation
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Hostel name is required';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      
      if (!formData.location.address.trim()) {
        newErrors.location = 'Address is required';
      }
      
      if (!formData.location.city.trim()) {
        newErrors.location = 'City is required';
      }
      
      if (!formData.location.state.trim()) {
        newErrors.location = 'State is required';
      }
    }
    
    // Step 2 validation
    if (currentStep === 2) {
      if (formData.pricePerYear <= 0) {
        newErrors.pricePerYear = 'Price must be greater than zero';
      }
      
      if (formData.roomTypes.length === 0) {
        newErrors.roomTypes = 'Please select at least one room type';
      }
      
      if (formData.availableRooms <= 0) {
        newErrors.availableRooms = 'Number of available rooms must be greater than zero';
      }
    }
    
    // Step 3 validation
    if (currentStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.contact.email && !emailRegex.test(formData.contact.email)) {
        newErrors.contact = 'Please enter a valid email address';
      }
      
      if (formData.contact.phone && !/^\d{10,15}$/.test(formData.contact.phone.replace(/\D/g, ''))) {
        newErrors.contact = 'Please enter a valid phone number';
      }
    }
    
    // For step 4 (review), we don't need validation before submission.
    // The form will be validated when handleSubmit is explicitly called.
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Only proceed if at least one image is uploaded or we have data in imageUrls
      if (formData.images.length === 0 && formData.imageUrls.length === 0) {
        setErrors({
          ...errors,
          images: 'At least one image is required'
        });
        setLoading(false);
        return;
      }
      
      // Call the service to add the hostel with the images
      await BusinessService.addHostel(formData);
      
      // Reset form and close modal
      setFormData(initialFormData);
      onHostelAdded();
      onClose();
    } catch (error) {
      console.error('Error adding hostel:', error);
      setErrors({
        ...errors,
        submit: 'Failed to add hostel. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-10 overflow-y-auto" 
        onClose={onClose}
        data-testid="add-hostel-modal"
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-start">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Hostel
                </Dialog.Title>
                
                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  data-testid="close-modal-button"
                  aria-label="Close modal"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Step indicator */}
              <div className="mt-4 mb-6">
                <div className="flex items-center">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <React.Fragment key={index}>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep > index + 1 
                            ? 'bg-indigo-600 text-white' 
                            : currentStep === index + 1 
                              ? 'bg-indigo-100 border-2 border-indigo-600 text-indigo-600' 
                              : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < totalSteps - 1 && (
                        <div 
                          className={`h-1 flex-1 ${
                            currentStep > index + 1 ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs">Basic Info</span>
                  <span className="text-xs">Rooms & Pricing</span>
                  <span className="text-xs">Amenities & Contact</span>
                  <span className="text-xs">Review</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="mt-4">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4" data-testid="form-step-1">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Hostel Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.name ? 'border-red-500' : ''
                        }`}
                        data-testid="hostel-name-input"
                        required
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.description ? 'border-red-500' : ''
                        }`}
                        data-testid="hostel-description-input"
                        required
                      />
                      {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="location.address"
                          name="location.address"
                          value={formData.location.address}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.location ? 'border-red-500' : ''
                          }`}
                          data-testid="hostel-address-input"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
                          City *
                        </label>
                        <input
                          type="text"
                          id="location.city"
                          name="location.city"
                          value={formData.location.city}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.location ? 'border-red-500' : ''
                          }`}
                          data-testid="hostel-city-input"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
                          State *
                        </label>
                        <input
                          type="text"
                          id="location.state"
                          name="location.state"
                          value={formData.location.state}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.location ? 'border-red-500' : ''
                          }`}
                          data-testid="hostel-state-input"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="location.country" className="block text-sm font-medium text-gray-700">
                          Country *
                        </label>
                        <input
                          type="text"
                          id="location.country"
                          name="location.country"
                          value={formData.location.country}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          data-testid="hostel-country-input"
                          required
                        />
                      </div>
                    </div>
                    
                    {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hostel Images (Up to 10) *
                      </label>
                      
                      {/* Display image previews */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="h-24 w-full rounded-md overflow-hidden bg-gray-100">
                                <Image
                                  src={getImagePreviewUrl(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm text-red-500 hover:text-red-700 focus:outline-none"
                                data-testid={`remove-image-${index}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Upload button */}
                      {formData.images.length < 10 && (
                        <div>
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                          >
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-300 transition-colors">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <input 
                                    id="image-upload" 
                                    name="image-upload" 
                                    type="file"
                                    accept="image/*"
                                    multiple 
                                    onChange={handleImageChange}
                                    className="sr-only"
                                    data-testid="image-upload-input"
                                  />
                                  <p className="pl-1">Click to upload images or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10 images</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      )}
                      
                      {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
                    </div>
                  </div>
                )}
                
                {/* Step 2: Rooms & Pricing */}
                {currentStep === 2 && (
                  <div className="space-y-4" data-testid="form-step-2">
                    <div>
                      <label htmlFor="pricePerYear" className="block text-sm font-medium text-gray-700">
                        Price Per Year (₦) *
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₦</span>
                        </div>
                        <input
                          type="number"
                          id="pricePerYear"
                          name="pricePerYear"
                          min="0"
                          value={formData.pricePerYear || ''}
                          onChange={handleNumberChange}
                          className={`pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.pricePerYear ? 'border-red-500' : ''
                          }`}
                          data-testid="hostel-price-input"
                          required
                        />
                      </div>
                      {errors.pricePerYear && <p className="mt-1 text-sm text-red-500">{errors.pricePerYear}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Types *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {roomTypeOptions.map((type) => (
                          <div key={type} className="flex items-center">
                            <input
                              id={`roomType-${type}`}
                              name="roomTypes"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={formData.roomTypes.includes(type)}
                              onChange={() => handleRoomTypeToggle(type)}
                              data-testid={`roomType-${type}`}
                            />
                            <label htmlFor={`roomType-${type}`} className="ml-2 block text-sm text-gray-700">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.roomTypes && <p className="mt-1 text-sm text-red-500">{errors.roomTypes}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="availableRooms" className="block text-sm font-medium text-gray-700">
                        Available Rooms/Beds *
                      </label>
                      <input
                        type="number"
                        id="availableRooms"
                        name="availableRooms"
                        min="1"
                        value={formData.availableRooms || ''}
                        onChange={handleNumberChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.availableRooms ? 'border-red-500' : ''
                        }`}
                        data-testid="hostel-availability-input"
                        required
                      />
                      {errors.availableRooms && <p className="mt-1 text-sm text-red-500">{errors.availableRooms}</p>}
                    </div>
                  </div>
                )}
                
                {/* Step 3: Amenities & Contact */}
                {currentStep === 3 && (
                  <div className="space-y-4" data-testid="form-step-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amenities
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {commonAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center">
                            <input
                              id={`amenity-${amenity}`}
                              name="amenities"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={formData.amenities.includes(amenity)}
                              onChange={() => handleAmenityToggle(amenity)}
                              data-testid={`amenity-${amenity}`}
                            />
                            <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-700">
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          id="contact.email"
                          name="contact.email"
                          value={formData.contact.email}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.contact ? 'border-red-500' : ''
                          }`}
                          data-testid="hostel-email-input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          id="contact.phone"
                          name="contact.phone"
                          value={formData.contact.phone}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.contact ? 'border-red-500' : ''
                          }`}
                          data-testid="hostel-phone-input"
                        />
                      </div>
                    </div>
                    {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
                    
                    <div>
                      <label htmlFor="rules" className="block text-sm font-medium text-gray-700">
                        Hostel Rules
                      </label>
                      <textarea
                        id="rules"
                        name="rules"
                        rows={3}
                        value={formData.rules}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        data-testid="hostel-rules-input"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="geolocation.latitude" className="block text-sm font-medium text-gray-700">
                          Latitude (Optional)
                        </label>
                        <input
                          type="number"
                          id="geolocation.latitude"
                          name="geolocation.latitude"
                          step="any"
                          value={formData.geolocation?.latitude || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          data-testid="hostel-latitude-input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="geolocation.longitude" className="block text-sm font-medium text-gray-700">
                          Longitude (Optional)
                        </label>
                        <input
                          type="number"
                          id="geolocation.longitude"
                          name="geolocation.longitude"
                          step="any"
                          value={formData.geolocation?.longitude || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          data-testid="hostel-longitude-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-4" data-testid="form-step-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-lg font-medium mb-2">Review Your Hostel Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Hostel Name:</p>
                          <p className="text-sm text-gray-600">{formData.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Price Per Year:</p>
                          <p className="text-sm text-gray-600">₦{formData.pricePerYear.toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Location:</p>
                          <p className="text-sm text-gray-600">
                            {formData.location.address}, {formData.location.city}, {formData.location.state}, {formData.location.country}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Available Rooms:</p>
                          <p className="text-sm text-gray-600">{formData.availableRooms}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Room Types:</p>
                          <p className="text-sm text-gray-600">{formData.roomTypes.join(', ')}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Amenities:</p>
                          <p className="text-sm text-gray-600">
                            {formData.amenities.length > 0 ? formData.amenities.join(', ') : 'None specified'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Contact:</p>
                          <p className="text-sm text-gray-600">
                            {formData.contact.email ? `Email: ${formData.contact.email}` : ''}
                            {formData.contact.email && formData.contact.phone ? ', ' : ''}
                            {formData.contact.phone ? `Phone: ${formData.contact.phone}` : ''}
                            {!formData.contact.email && !formData.contact.phone && 'None specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Description:</p>
                        <p className="text-sm text-gray-600">{formData.description}</p>
                      </div>
                      
                      {formData.rules && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Rules:</p>
                          <p className="text-sm text-gray-600">{formData.rules}</p>
                        </div>
                      )}
                      
                      {formData.images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Images ({formData.images.length}):</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                            {formData.images.map((file, index) => (
                              <div key={index} className="relative h-16 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                  src={getImagePreviewUrl(file)}
                                  alt={`Image ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {errors.submit && <p className="mt-1 text-sm text-red-500">{errors.submit}</p>}
                  </div>
                )}
                
                <div className="mt-8 flex justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      data-testid="previous-step-button"
                    >
                      Previous
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      data-testid="cancel-button"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      data-testid="next-step-button"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      disabled={loading}
                      data-testid="submit-hostel-button"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Add Hostel'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}