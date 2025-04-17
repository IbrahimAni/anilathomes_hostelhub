"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { auth } from "@/config/firebase";
import { BusinessService } from '@/services';
import { RoomData, AgentCommissionData } from '@/types/business';
import RoomOccupancy from '@/components/dashboard/business/RoomOccupancy';
import AgentCommissions from '@/components/dashboard/business/AgentCommissions';
import AddHostelModal from '@/components/dashboard/business/AddHostelModal';
import Image from 'next/image';

const PropertiesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);  const [properties, setProperties] = useState<{ 
    id: string;
    name: string;
    location?: string;
    imageUrl?: string;
    availableRooms?: number; 
  }[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [agentsData, setAgentsData] = useState<AgentCommissionData[]>([]);
  const [isAddHostelModalOpen, setIsAddHostelModalOpen] = useState(false);

  // Function to fetch data for a selected property
  const fetchPropertyData = useCallback(async (propertyId: string) => {
    try {
      setLoading(true);
      
      // Fetch room occupancy data for the selected property
      const rooms = await BusinessService.getRoomOccupancy(propertyId);
      setRoomsData(rooms);
      
      // Fetch agent commission data
      const agents = await BusinessService.getAgentCommissions();
      setAgentsData(agents);
    } catch (error) {
      console.error(`Error fetching data for property ${propertyId}:`, error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch all properties - wrapped in useCallback to prevent recreation on every render
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // Fetch properties owned by this business
      const hostels = await BusinessService.getBusinessHostels();
      setProperties(hostels);

      // If there are properties, fetch data for the first one
      if (hostels.length > 0) {
        setSelectedProperty(hostels[0].id);
        await fetchPropertyData(hostels[0].id);
      } else {
        // Make sure we stop loading even if there are no properties
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  }, [router, fetchPropertyData]);

  // Add the missing useEffect hook to trigger initial data fetch
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle property tab change
  const handleTabChange = async (index: number) => {
    if (properties[index]) {
      setSelectedProperty(properties[index].id);
      await fetchPropertyData(properties[index].id);
    }
  };

  // Handle opening the Add Hostel modal
  const handleAddHostelClick = () => {
    setIsAddHostelModalOpen(true);
  };

  // Handle closing the Add Hostel modal
  const handleCloseAddHostelModal = () => {
    setIsAddHostelModalOpen(false);
  };

  // Handle successfully adding a new hostel
  const handleHostelAdded = () => {
    fetchProperties();
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  // Loading state
  if (loading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="properties-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="properties-title">Property Management</h1>
        <p className="text-gray-600">Manage your hostels, track room occupancy, and monitor agent commissions.</p>
      </div>

      {properties.length > 0 ? (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Properties</h2>
              <button 
                className="text-sm bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                data-testid="add-property-button"
                aria-label="Add new property"
                onClick={handleAddHostelClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
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
                Add Property
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <Tab.Group onChange={handleTabChange}>
              <Tab.List className="flex space-x-1 rounded-xl bg-indigo-50 p-1">
                {properties.map((property) => (
                  <Tab
                    key={property.id}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60',
                        selected
                          ? 'bg-white text-indigo-700 shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                      )
                    }
                    data-testid={`property-tab-${property.id}`}
                  >
                    {property.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-4">
                {properties.map((property) => (
                  <Tab.Panel
                    key={property.id}
                    className={classNames(
                      'rounded-xl p-3',
                      'focus:outline-none'
                    )}
                  >                    <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Property image */}
                        <div className="w-full md:w-1/3 h-48 relative rounded-lg overflow-hidden">                          {property.imageUrl ? (
                            <Image 
                              src={property.imageUrl}
                              alt={`${property.name}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                              data-testid={`property-image-${property.id}`}
                            />
                          ) : (
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M9 22V12h6v10"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Property details */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {property.location || "No location information available"}
                              </p>
                              <p className="text-sm text-gray-700 mt-2 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1 text-indigo-600"
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
                                <span className="font-medium">
                                  {typeof property.availableRooms === 'number' ? `${property.availableRooms} room${property.availableRooms !== 1 ? 's' : ''} available` : 'Room information not available'}
                                </span>
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0 space-x-2">
                              <button 
                                className="text-sm bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-50 transition-colors"
                                data-testid={`edit-property-${property.id}`}
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
                                className="text-sm bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-50 transition-colors"
                                data-testid={`view-details-${property.id}`}
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Room occupancy section with loading state */}                    <div className="mb-8">
                      {loading && property.id === selectedProperty ? (
                        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-60" data-testid="room-occupancy-loading">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                      ) : roomsData.length > 0 ? (
                        <RoomOccupancy 
                          hostelName={property.name}
                          rooms={roomsData}
                          testId={`room-occupancy-${property.id}`}
                        />
                      ) : (
                        <div className="bg-white p-6 rounded-lg shadow" data-testid="rooms-summary">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Room Occupancy Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-indigo-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600">Total Rooms</p>
                              <p className="text-2xl font-bold text-indigo-700">{property.availableRooms || 0}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600">Available</p>
                              <p className="text-2xl font-bold text-green-700">{property.availableRooms || 0}</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600">Occupied</p>
                              <p className="text-2xl font-bold text-amber-700">0</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-4 text-center">
                            {property.availableRooms && property.availableRooms > 0 ? 
                              `All rooms in this property share the same configuration.` : 
                              'No rooms have been added to this property yet.'
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Agent commissions section with loading state */}
                    <div className="mb-4">
                      {loading && property.id === selectedProperty ? (
                        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-60" data-testid="agent-commissions-loading">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                      ) : agentsData.length > 0 ? (
                        <AgentCommissions 
                          agents={agentsData}
                          testId={`agent-commissions-${property.id}`}
                        />
                      ) : (
                        <div className="bg-white p-6 rounded-lg shadow text-center" data-testid="no-agents-message">
                          <p className="text-gray-500">No agent commissions found for this property</p>
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center" data-testid="no-properties-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h2>
          <p className="text-gray-500 mb-6">You don&apos;t have any properties registered in the system yet.</p>
          <button 
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
            data-testid="add-first-property-button"
            onClick={handleAddHostelClick}
          >
            Add Your First Property
          </button>
        </div>
      )}

      {/* Add Hostel Modal */}
      <AddHostelModal 
        isOpen={isAddHostelModalOpen}
        onClose={handleCloseAddHostelModal}
        onHostelAdded={handleHostelAdded}
      />
    </div>
  );
};

export default PropertiesPage;