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
import { default as ConfirmationModal } from "@/components/common/ConfirmationModal";

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
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [agentsData, setAgentsData] = useState<AgentCommissionData[]>([]);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        setLoading(true);
        // Check if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser) {
          router.push("/login");
          return;
        }

        // Fetch the hostel details
        const hostelDetails = await BusinessService.getHostelDetails(hostelId);
        setHostel(hostelDetails);

        // Fetch room occupancy data
        const rooms = await BusinessService.getRoomOccupancy(hostelId);
        setRoomsData(rooms);

        // Fetch agent commission data
        // const agents = await BusinessService.getAgentCommissions();
        setAgentsData([]); // Empty array to show the empty state
      } catch (error) {
        console.error("Error fetching hostel details:", error);
        toast.error("Failed to load hostel details");
      } finally {
        setLoading(false);
      }
    };

    if (hostelId) {
      fetchHostelDetails();
    }
  }, [hostelId, router]);

  const handleDeleteClick = () => {
    setIsConfirmDeleteModalOpen(true);
  };

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
          href="/dashboard/business/properties"
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
      {/* Hostel Header */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold text-gray-900"
              data-testid="hostel-name"
            >
              {hostel.name}
            </h1>
            <div className="space-x-2">
              <button
                className="text-sm bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-50 transition-colors"
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
                className="text-sm bg-white border border-red-300 text-red-700 py-1 px-3 rounded hover:bg-red-50 transition-colors"
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
              {hostel.imageUrls &&
                Array.isArray(hostel.imageUrls) &&
                hostel.imageUrls.length > 0 &&
                hostel.imageUrls
                  .filter((url) => url && url.trim() !== "" && !url.startsWith("blob:"))
                  .map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative h-48 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        priority={index === 0} // Add priority to first image for LCP optimization
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        data-testid={`hostel-image-${index}`}
                      />
                    </div>
                  ))}

              {(!hostel.imageUrls ||
                !Array.isArray(hostel.imageUrls) ||
                hostel.imageUrls.length === 0 ||
                hostel.imageUrls.filter((url) => url && url.trim() !== "" && !url.startsWith("blob:")).length === 0) && (
                <div className="col-span-full bg-gray-200 h-48 flex items-center justify-center text-gray-500">
                  No images available
                </div>
              )}
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
          </div>
          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Amenities
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {hostel.amenities && hostel.amenities.length > 0 ? (
                  hostel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-indigo-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-gray-500">
                    No amenities listed
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Contact Info */}
          {hostel.contact && (hostel.contact.email || hostel.contact.phone) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Contact Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {hostel.contact.email && (
                  <div className="mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
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
                    <span className="text-gray-700">
                      {hostel.contact.email}
                    </span>
                  </div>
                )}
                {hostel.contact.phone && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
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
                    <span className="text-gray-700">
                      {hostel.contact.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* House Rules */}
          {hostel.rules && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                House Rules
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {hostel.rules}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Room Occupancy Section */}
      <div className="mb-8">
        {roomsData.length > 0 ? (
          <RoomOccupancy
            hostelName={hostel.name}
            rooms={roomsData}
            testId={`room-occupancy-${hostelId}`}
          />
        ) : (
          <div
            className="bg-white p-6 rounded-lg shadow"
            data-testid="rooms-summary"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Room Occupancy Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {hostel.availableRooms || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-700">
                  {hostel.availableRooms || 0}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-amber-700">0</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              {hostel.availableRooms && hostel.availableRooms > 0
                ? `All rooms in this property share the same configuration.`
                : "No rooms have been added to this property yet."}
            </p>
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
    </div>
  );
};

export default HostelDetailsPage;
