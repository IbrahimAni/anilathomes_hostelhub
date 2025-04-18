"use client";

import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BusinessService } from "@/services";
import Image from "next/image";
import { toast } from "react-hot-toast";

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
  id: string;
  name: string;
  description: string;
  location: HostelLocation;
  images: File[];
  imageUrls: string[];
  existingImages: string[];
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

interface EditHostelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onHostelUpdated: () => void;
  hostel: {
    id: string;
    name: string;
    location?: string;
    imageUrl?: string;
    availableRooms?: number;
  } | null;
}

// Define the expected structure for hostel details fetched from the service
interface HostelDetails {
  id: string;
  name?: string;
  description?: string;
  location?: string | HostelLocation; // Can be string or object
  locationDetails?: HostelLocation; // Another possible location structure
  images?: string[];
  imageUrls?: string[];
  imageUrl?: string;
  pricePerYear?: number;
  roomTypes?: string[];
  availableRooms?: number;
  amenities?: string[];
  contact?: HostelContact;
  rules?: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

const initialFormData: HostelFormData = {
  id: "",
  name: "",
  description: "",
  location: {
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
  },
  images: [],
  imageUrls: [],
  existingImages: [],
  pricePerYear: 0,
  roomTypes: ["Single"],
  availableRooms: 0,
  amenities: [],
  contact: {
    email: "",
    phone: "",
  },
  rules: "",
  geolocation: {
    latitude: 0,
    longitude: 0,
  },
};

const commonAmenities = [
  "Wi-Fi",
  "Security",
  "Water Supply",
  "Electricity",
  "Bathroom",
  "Kitchen",
  "Laundry",
  "Study Room",
  "TV Room",
  "Cafeteria",
  "Parking",
  "Generator",
  "Air Conditioning",
];

const roomTypeOptions = [
  "Single",
  "Self Contained",
  "Room and Parllor Self Contained",
  "Double",
  "Dormitory",
  "En-suite",
  "Studio",
];

export default function EditHostelDrawer({
  isOpen,
  onClose,
  onHostelUpdated,
  hostel
}: EditHostelDrawerProps) {
  const [formData, setFormData] = useState<HostelFormData>(initialFormData);
  type HostelFormErrorKeys =
    | "name"
    | "description"
    | "location.address"
    | "location.city"
    | "location.state"
    | "images"
    | "pricePerYear"
    | "availableRooms"
    | "roomTypes"
    | "contact.email"
    | "contact.phone"
    | "submit";
  const [errors, setErrors] = useState<Partial<Record<HostelFormErrorKeys, string>>>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isDeleting, setIsDeleting] = useState<string[]>([]);

  // Fetch hostel details when the drawer is opened
  useEffect(() => {
    if (isOpen && hostel) {
      fetchHostelDetails(hostel.id);
      // Reset step to 1 whenever a new hostel is edited
      setCurrentStep(1);
    }
  }, [isOpen, hostel]);
  const fetchHostelDetails = async (id: string) => {
    setLoading(true);
    try {
      console.log("Fetching details for hostel ID:", id);
      // Fetch complete hostel details from the service
      const details: HostelDetails = await BusinessService.getHostelDetails(id);
      console.log("Received hostel details:", details);
      
      // Process images from all possible sources
      // Deduplicate images by merging all sources
      const existingImagesSet = new Set<string>();
      // Add any arrays of images
      if (details.images && Array.isArray(details.images)) {
        details.images.forEach(url => url && existingImagesSet.add(url));
      }
      if (details.imageUrls && Array.isArray(details.imageUrls)) {
        details.imageUrls.forEach(url => url && existingImagesSet.add(url));
      }
      // Add single imageUrl if present
      if (details.imageUrl && typeof details.imageUrl === 'string') {
        existingImagesSet.add(details.imageUrl);
      }
      const existingImages = Array.from(existingImagesSet);
      console.log("Final existing images (deduplicated):", existingImages);
      
      // Handle location data which might be a string or an object
      let locationData: HostelLocation = {
        address: "",
        city: "",
        state: "",
        country: "Nigeria"
      };
      
      if (details.location) {
        if (typeof details.location === 'string') {
          // If location is a string, try to parse it into parts
          const locationParts = details.location.split(',').map(part => part.trim());
          locationData = {
            address: locationParts[0] || "",
            city: locationParts.length > 1 ? locationParts[1] : "",
            state: locationParts.length > 2 ? locationParts[2] : "",
            country: locationParts.length > 3 ? locationParts[3] : "Nigeria",
          };
          console.log("Parsed location from string:", locationData);
        } else if (details.locationDetails && typeof details.locationDetails === 'object') {
          locationData = {
            address: details.locationDetails.address || "",
            city: details.locationDetails.city || "",
            state: details.locationDetails.state || "",
            country: details.locationDetails.country || "Nigeria",
          };
          console.log("Using locationDetails:", locationData);
        } else if (typeof details.location === 'object') {
          locationData = {
            address: details.location.address || "",
            city: details.location.city || "",
            state: details.location.state || "",
            country: details.location.country || "Nigeria",
          };
          console.log("Using location object:", locationData);
        }
      }
      
      // Set the form data with the fetched details
      setFormData({
        id: details.id,
        name: details.name || "",
        description: details.description || "",
        location: locationData,
        images: [],
        imageUrls: [],
        existingImages: existingImages,
        pricePerYear: details.pricePerYear || 0,
        roomTypes: details.roomTypes || ["Single"],
        availableRooms: details.availableRooms || 0,
        amenities: details.amenities || [],
        contact: {
          email: details.contact?.email || "",
          phone: details.contact?.phone || "",
        },
        rules: details.rules || "",
        geolocation: details.geolocation || {
          latitude: 0,
          longitude: 0,
        },
      });
      
      // Clear previous errors
      setErrors({});
    } catch (error) {
      console.error("Error fetching hostel details:", error);
      toast.error("Failed to load property details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      if (parent === "geolocation") {
        setFormData((prev) => ({
          ...prev,
          geolocation: {
            ...(prev.geolocation || { latitude: 0, longitude: 0 }),
            [child]:
              value === ""
                ? ""
                : child === "latitude" || child === "longitude"
                ? Number(value)
                : value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...((prev[parent as keyof typeof prev] as object) || {}),
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Check if adding these files would exceed the 10 image limit
      if (formData.images.length + formData.existingImages.length + newFiles.length > 10) {
        setErrors({
          ...errors,
          images: "Maximum 10 images allowed",
        });
        return;
      }

      // Create object URLs for each file
      const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imageUrls: [...prev.imageUrls, ...newImageUrls],
      }));

      // Clear any previous errors
      if (errors.images) {
        setErrors({ ...errors, images: undefined });
      }
    }
  };

  const handleRemoveNewImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(formData.imageUrls[index]);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setIsDeleting((prev) => [...prev, imageUrl]);
    
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((url) => url !== imageUrl),
    }));
    
    setTimeout(() => {
      setIsDeleting((prev) => prev.filter(url => url !== imageUrl));
    }, 1000);
  };

  const handleToggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const amenities = [...prev.amenities];
      if (amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: amenities.filter((a) => a !== amenity),
        };
      } else {
        return {
          ...prev,
          amenities: [...amenities, amenity],
        };
      }
    });
  };
  
  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  };

  const validateCurrentStep = () => {
    const newErrors: Partial<Record<HostelFormErrorKeys, string>> = {};

  switch (currentStep) {
    case 1: // Basic Info
        if (!formData.name.trim()) newErrors.name = "Property name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        break;
      case 2: // Location
        if (!formData.location.address.trim()) newErrors["location.address"] = "Address is required";
        if (!formData.location.city.trim()) newErrors["location.city"] = "City is required";
        if (!formData.location.state.trim()) newErrors["location.state"] = "State is required";
        break;
      case 3: // Images
        if (formData.images.length === 0 && formData.existingImages.length === 0) {
          newErrors.images = "At least one image is required";
        }
        break;
      case 4: // Rooms & Amenities
        if (formData.pricePerYear <= 0) newErrors.pricePerYear = "Price must be greater than 0";
        if (formData.availableRooms <= 0) newErrors.availableRooms = "Available rooms must be greater than 0";
        if (formData.roomTypes.length === 0) newErrors.roomTypes = "Select at least one room type";
        break;
      case 5: // Contact & Rules
        if (!formData.contact.email.trim()) newErrors["contact.email"] = "Email is required";
        if (!formData.contact.phone.trim()) newErrors["contact.phone"] = "Phone number is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep !== totalSteps) {
      handleNext();
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Format the data to match the API expectations
      const updatedHostel = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        pricePerYear: formData.pricePerYear,
        roomTypes: formData.roomTypes,
        availableRooms: formData.availableRooms,
        amenities: formData.amenities,
        contact: formData.contact,
        rules: formData.rules,
        geolocation: formData.geolocation,
        existingImages: formData.existingImages,
        newImages: formData.images
      };

      // Call the API to update the hostel
      await BusinessService.updateHostel(updatedHostel);
      
      toast.success("Property updated successfully!");
      onHostelUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating hostel:", error);
      setErrors({
        submit: "Failed to update property. Please try again later.",
      });
      toast.error("Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white px-4 py-6 sm:px-6 shadow-md">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Edit Property: {hostel?.name || ''}
                        </Dialog.Title>
                        <button type="button" onClick={onClose} className="ml-3 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
                    </div>

                    {/* Body */}
                    {loading ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                          <div className="space-y-4" data-testid="edit-basic-info-step">
                            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Property Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                              <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                          </div>
                        )}

                        {/* Step 2: Location */}
                        {currentStep === 2 && (
                          <div className="space-y-4" data-testid="edit-location-step">
                            <h3 className="text-lg font-medium text-gray-900">Location</h3>
                            <div>
                              <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="location.address"
                                id="location.address"
                                value={formData.location.address}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors["location.address"] && <p className="mt-1 text-sm text-red-600">{errors["location.address"]}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  name="location.city"
                                  id="location.city"
                                  value={formData.location.city}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors["location.city"] && <p className="mt-1 text-sm text-red-600">{errors["location.city"]}</p>}
                              </div>
                              <div>
                                <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  name="location.state"
                                  id="location.state"
                                  value={formData.location.state}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors["location.state"] && <p className="mt-1 text-sm text-red-600">{errors["location.state"]}</p>}
                              </div>
                            </div>
                            <div>
                              <label htmlFor="location.country" className="block text-sm font-medium text-gray-700">Country</label>
                              <input
                                type="text"
                                name="location.country"
                                id="location.country"
                                value={formData.location.country}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Step 3: Images */}
                        {currentStep === 3 && (
                          <div className="space-y-4" data-testid="edit-images-step">
                            <h3 className="text-lg font-medium text-gray-900">Property Images</h3>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Upload Images <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="file"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                              />
                              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                            </div>
                            {/* Existing Images */}
                            {formData.existingImages.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  {formData.existingImages.map((url, idx) => (
                                    <div key={`existing-${idx}`} className="relative group h-32">
                                      <Image src={url} alt={`Image ${idx+1}`} fill className="object-cover rounded-lg" />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(url)}
                                        className="absolute top-1 right-1 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                                      >
                                        <XMarkIcon className="h-5 w-5 text-red-500" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* New Images */}
                            {formData.imageUrls.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">New Images</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  {formData.imageUrls.map((url, idx) => (
                                    <div key={`new-${idx}`} className="relative group h-32">
                                      <Image src={url} alt={`New ${idx+1}`} fill className="object-cover rounded-lg" />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveNewImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                                      >
                                        <XMarkIcon className="h-5 w-5 text-red-500" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Step 4: Rooms & Amenities */}
                        {currentStep === 4 && (
                          <div className="space-y-4" data-testid="edit-rooms-amenities-step">
                            <h3 className="text-lg font-medium text-gray-900">Rooms & Amenities</h3>
                            <div>
                              <label htmlFor="pricePerYear" className="block text-sm font-medium text-gray-700">Price Per Year <span className="text-red-500">*</span></label>
                              <input
                                type="number"
                                name="pricePerYear"
                                id="pricePerYear"
                                value={formData.pricePerYear}
                                onChange={handleNumberChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.pricePerYear && <p className="mt-1 text-sm text-red-600">{errors.pricePerYear}</p>}
                            </div>
                            <div>
                              <label htmlFor="availableRooms" className="block text-sm font-medium text-gray-700">Available Rooms <span className="text-red-500">*</span></label>
                              <input
                                type="number"
                                name="availableRooms"
                                id="availableRooms"
                                value={formData.availableRooms}
                                onChange={handleNumberChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.availableRooms && <p className="mt-1 text-sm text-red-600">{errors.availableRooms}</p>}
                            </div>
                          </div>
                        )}

                        {/* Step 5: Contact & Rules */}
                        {currentStep === 5 && (
                          <div className="space-y-4" data-testid="edit-contact-rules-step">
                            <h3 className="text-lg font-medium text-gray-900">Contact & Rules</h3>
                            <div>
                              <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                              <input
                                type="email"
                                name="contact.email"
                                id="contact.email"
                                value={formData.contact.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors["contact.email"] && <p className="mt-1 text-sm text-red-600">{errors["contact.email"]}</p>}
                            </div>
                            <div>
                              <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                name="contact.phone"
                                id="contact.phone"
                                value={formData.contact.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors["contact.phone"] && <p className="mt-1 text-sm text-red-600">{errors["contact.phone"]}</p>}
                            </div>
                            <div>
                              <label htmlFor="rules" className="block text-sm font-medium text-gray-700">Rules</label>
                              <textarea
                                name="rules"
                                id="rules"
                                rows={3}
                                value={formData.rules}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div> // Closing tag for Step 5 div
                        )}
                      </form>
                    )}

                    {/* Footer */}
                    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-6 sm:px-6 flex justify-between">
                      <button
                        type="button"
                        className={`${
                          currentStep === 1
                            ? "invisible"
                            : "visible bg-white border-gray-300 text-gray-700"
                        } py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-50`}
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                          loading
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        disabled={loading}
                      >
                        {loading
                          ? "Updating..."
                          : currentStep === totalSteps
                          ? "Update Property"
                          : "Next"}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
