"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { BusinessService } from "@/services";
import { RoomData, AgentCommissionData } from "@/types/business";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";
import RoomOccupancy from "@/components/dashboard/business/RoomOccupancy";
import AgentCommissions from "@/components/dashboard/business/AgentCommissions";
import { default as ConfirmationModal } from '@/components/common/ConfirmationModal';
import EditHostelDrawer from '@/components/dashboard/business/EditHostelDrawer';

interface HostelDetails {
  id: string;
  name: string;
  description: string;
  location: string;
  locationDetails?: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  imageUrls: string[];
  price: string;
  pricePerYear: number;
  roomTypes: string[];
  availableRooms: number;
  amenities: string[];
  contact?: {
    email: string;
    phone: string;
  };
  rules?: string;
  createdAt?: Date;
  rating?: number;
  reviewCount?: number;
}

const HostelDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const hostelId = params.id as string;
  // State for opening edit drawer
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [agentsData, setAgentsData] = useState<AgentCommissionData[]>([]);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reusable fetch function to load hostel details, rooms, and agents
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/login');
        return;
      }
      const hostelDetails = await BusinessService.getHostelDetails(hostelId) as HostelDetails;
      setHostel(hostelDetails);
      const rooms = await BusinessService.getRoomOccupancy(hostelId);
      setRoomsData(rooms);
      const agents = await BusinessService.getAgentCommissions();
      // Filter agents who have bookings for this hostel by matching the hostel name
      const filtered = agents.filter(agent =>
        agent.bookings.some(b => b.hostelName === hostelDetails.name)
      );
      setAgentsData(filtered);
    } catch (error) {
      console.error('Error fetching hostel details:', error);
      toast.error('Failed to load hostel details');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (hostelId) fetchDetails();
  }, [hostelId]);

  const handleDeleteClick = () => {
    setIsConfirmDeleteModalOpen(true);
  };
  const handleEditClick = () => setIsEditDrawerOpen(true);

  const handleDeleteConfirm = async () => {
    if (!hostel) return;

    setIsDeleting(true);
    try {
      await BusinessService.deleteHostel(hostelId);
      toast.success(`Property "${hostel.name}" has been deleted`);
      router.push("/dashboard/business/properties");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteModalOpen(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-testid="hostel-details-loading"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Not found state
  if (!hostel) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        data-testid="hostel-not-found"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Property Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The property you&lsquo;re looking for doesn&lsquo;t exist or you don&lsquo;t have access
          to it.
        </p>
        <Link
          href="/dashboard/business/properties"
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href={`/dashboard/business/properties?selected=${hostel.id}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          data-testid="back-to-properties"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Properties
        </Link>
      </div>
      {/* Hostel Header */}      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-3"></div>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Hostel Name and Type (Left Side) */}
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-gray-900"
                  data-testid="hostel-name"
                >
                  {hostel.name}
                </h1>
                <div className="flex items-center mt-1">
                  <span className="text-sm bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full">
                    {hostel.roomTypes[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Right Side) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEditClick}
                className="text-sm bg-white border border-gray-300 text-gray-700 py-1.5 px-4 rounded-full shadow-sm hover:bg-gray-50 transition-colors flex items-center"
                data-testid="edit-property-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                className="text-sm bg-white border border-red-300 text-red-700 py-1.5 px-4 rounded-full shadow-sm hover:bg-red-50 transition-colors flex items-center"
                data-testid="delete-property-button"
                onClick={handleDeleteClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Hostel Details */}
        <div className="p-6">
          {" "}
          {/* Image Gallery */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Property Images
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                [...new Set([...(Array.isArray(hostel.imageUrls) ? hostel.imageUrls : []),
                  ...(Array.isArray((hostel as any).images) ? (hostel as any).images : [])])]
                  .filter((url) => url && url.trim() !== "" && !url.startsWith("blob:"))
                  .map((imageUrl, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        data-testid={`hostel-image-${index}`}
                      />
                    </div>
                  ))
              }
              {
                [...new Set([...(Array.isArray(hostel.imageUrls) ? hostel.imageUrls : []),
                  ...(Array.isArray((hostel as any).images) ? (hostel as any).images : [])])]
                  .filter((url) => url && url.trim() !== "" && !url.startsWith("blob:")).length === 0 && (
                  <div className="col-span-full bg-gray-200 h-48 flex items-center justify-center text-gray-500">
                    No images available
                  </div>
                )
              }
            </div>
          </div>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Details
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="text-gray-900">{hostel.location}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="text-gray-900">{hostel.price}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Room Types
                  </h3>
                  <p className="text-gray-900">{hostel.roomTypes.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Available Rooms
                  </h3>
                  <p className="text-gray-900">{hostel.availableRooms}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Description
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{hostel.description}</p>
              </div>
            </div>
          </div>          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Amenities
            </h2>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hostel.amenities && hostel.amenities.length > 0 ? (
                  hostel.amenities.map((amenity, index) => {
                    let icon = (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 13l4 4L19 7"
                      />
                    );
                    
                    // Custom icons based on amenity type
                    if (amenity.toLowerCase().includes('wifi')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8.111 16.404a5.5 5.5 0 007.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('security')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('water')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('electricity') || amenity.toLowerCase().includes('power')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('kitchen') || amenity.toLowerCase().includes('cook')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 3h18v18H3V3z M3 9h18 M9 21V9 M15 21V9"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('bathroom')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 10H3m0 0l2 8h14l2-8"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('laundry')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M14 12a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('generator')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      );
                    } else if (amenity.toLowerCase().includes('air conditioning') || amenity.toLowerCase().includes('ac')) {
                      icon = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      );
                    }
                    
                    return (
                      <div key={index} className="flex items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
                        <div className="bg-indigo-100 p-2 rounded-md mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {icon}
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{amenity}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-full text-gray-500 text-center py-4">
                    No amenities listed
                  </p>
                )}
              </div>
            </div>
          </div>          {/* Contact Info and House Rules in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Contact Info */}
            {hostel.contact && (hostel.contact.email || hostel.contact.phone) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Information
                </h2>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-indigo-500">
                  <div className="flex flex-col space-y-3">
                    {hostel.contact.email && (
                      <div className="flex items-center group">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3 group-hover:bg-indigo-200 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Email</span>
                          <p className="text-gray-700 font-medium">
                            {hostel.contact.email}
                          </p>
                        </div>
                      </div>
                    )}
                    {hostel.contact.phone && (
                      <div className="flex items-center group">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3 group-hover:bg-indigo-200 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Phone</span>
                          <p className="text-gray-700 font-medium">
                            {hostel.contact.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* House Rules */}
            {hostel.rules && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  House Rules
                </h2>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-amber-500">
                  <div className="prose prose-sm max-w-none">
                    {hostel.rules.split('\n').map((rule, index) => (
                      rule.trim() && (
                        <div key={index} className="mb-2 flex items-start">
                          <div className="bg-amber-100 p-0.5 rounded-full mr-2 mt-1.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 text-amber-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700">{rule}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>      {/* Room Occupancy Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Room Occupancy
        </h2>
        
        {roomsData.length > 0 ? (
          <RoomOccupancy
            hostelName={hostel.name}
            rooms={roomsData}
            testId={`room-occupancy-${hostelId}`}
          />
        ) : (
          <div
            className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-lg shadow-md border border-gray-100"
            data-testid="rooms-summary"
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Room Occupancy Summary</h3>
              <p className="text-sm text-gray-500">Overview of room availability status</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Rooms</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-indigo-700">
                      {hostel.availableRooms || 0}
                    </p>
                    <p className="text-xs text-gray-500 ml-2">units</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-green-600">
                      {hostel.availableRooms || 0}
                    </p>
                    <p className="text-xs text-gray-500 ml-2">
                      ({hostel.availableRooms ? '100%' : '0%'})
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupied</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-amber-600">0</p>
                    <p className="text-xs text-gray-500 ml-2">(0%)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {hostel.availableRooms && hostel.availableRooms > 0 ? (
              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="mr-3 text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Room Configuration</span>
                    <p className="text-sm text-gray-500">
                      All rooms in this property share the same configuration. Add specific room information to manage individual rooms.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-center">
                <div className="mr-3 text-amber-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-amber-800">
                  No rooms have been added to this property yet. Add rooms to manage occupancy.
                </p>
              </div>
            )}
          </div>
        )}
      </div>{" "}
      {/* Assigned Agents Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Assigned Agents
          </h2>
          <button
            className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
            data-testid="add-agent-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Agent
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Always show empty state since we're setting agentsData to [] */}
          <div className="text-center py-8" data-testid="no-agents-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-gray-500">
              No agents are currently assigned to this property
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Assign agents to help manage and market this property
            </p>
          </div>
        </div>
      </div>
      {/* Agent Commissions Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Agent Commissions
        </h2>
        {agentsData.length > 0 ? (
          <AgentCommissions
            agents={agentsData}
            testId={`agent-commissions-${hostelId}`}
          />
        ) : (
          <div
            className="bg-white p-6 rounded-lg shadow text-center"
            data-testid="no-commissions-message"
          >
            <p className="text-gray-500">
              No agent commissions found for this property
            </p>
          </div>
        )}
      </div>
      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Property"
        message={`Are you sure you want to delete "${hostel?.name}"? This action cannot be undone and will remove all associated data.`}
        confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
        cancelButtonText="Cancel"
        danger={true}
      />
      {/* Edit Hostel Drawer */}
      <EditHostelDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        hostel={{
          id: hostel!.id,
          name: hostel!.name,
          location: hostel!.location,
          imageUrl: hostel!.imageUrls[0],
          availableRooms: hostel!.availableRooms,
        }}
        onHostelUpdated={() => {
          setIsEditDrawerOpen(false);
          fetchDetails();
        }}
      />
    </div>
  );
};

export default HostelDetailsPage;
