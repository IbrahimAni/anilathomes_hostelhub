"use client";

import React from 'react';
import { Tab } from '@headlessui/react';
import RoomOccupancy from '@/components/dashboard/business/RoomOccupancy';
import AgentCommissions from '@/components/dashboard/business/AgentCommissions';

// Mock data for room occupancy
const mockRoomData = [
  {
    roomId: "room1",
    roomNumber: "101",
    roomType: "Single Room",
    capacity: 1,
    occupiedCount: 1,
    occupants: [
      {
        id: "student1",
        name: "John Doe",
        leaseEnd: "2023-12-31",
        paymentStatus: "paid" as const,
        agentAssisted: true,
        agentName: "Sarah Johnson"
      }
    ]
  },
  {
    roomId: "room2",
    roomNumber: "102",
    roomType: "Double Room",
    capacity: 2,
    occupiedCount: 2,
    occupants: [
      {
        id: "student2",
        name: "Michael Brown",
        leaseEnd: "2023-11-30",
        paymentStatus: "paid" as const,
        agentAssisted: false
      },
      {
        id: "student3",
        name: "Emma Wilson",
        leaseEnd: "2024-01-15",
        paymentStatus: "pending" as const,
        agentAssisted: true,
        agentName: "David Lee"
      }
    ]
  },
  {
    roomId: "room3",
    roomNumber: "103",
    roomType: "Single Room",
    capacity: 1,
    occupiedCount: 0,
    occupants: []
  },
  {
    roomId: "room4",
    roomNumber: "104",
    roomType: "Single Room",
    capacity: 1,
    occupiedCount: 1,
    occupants: [
      {
        id: "student4",
        name: "James Smith",
        leaseEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
        paymentStatus: "paid" as const,
        agentAssisted: true,
        agentName: "Sarah Johnson"
      }
    ]
  },
  {
    roomId: "room5",
    roomNumber: "105",
    roomType: "Double Room",
    capacity: 2,
    occupiedCount: 1,
    occupants: [
      {
        id: "student5",
        name: "Olivia Davis",
        leaseEnd: "2024-02-28",
        paymentStatus: "overdue" as const,
        agentAssisted: false
      }
    ]
  }
];

// Mock data for agent commissions
const mockAgentData = [
  {
    agentId: "agent1",
    agentName: "Sarah Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    totalCommission: 75000,
    pendingCommission: 25000,
    paidCommission: 50000,
    bookingsCount: 3,
    lastBookingDate: "2023-11-15",
    bookings: [
      {
        id: "booking1",
        hostelName: "Green Haven Hostel",
        roomNumber: "101",
        studentName: "John Doe",
        bookingDate: "2023-10-05",
        amount: 150000,
        commissionAmount: 15000,
        commissionStatus: "paid" as const
      },
      {
        id: "booking2",
        hostelName: "Green Haven Hostel",
        roomNumber: "104",
        studentName: "James Smith",
        bookingDate: "2023-11-15",
        amount: 150000,
        commissionAmount: 15000,
        commissionStatus: "paid" as const
      },
      {
        id: "booking3",
        hostelName: "Sunshine Towers",
        roomNumber: "203",
        studentName: "Linda Brown",
        bookingDate: "2023-11-20",
        amount: 250000,
        commissionAmount: 25000,
        commissionStatus: "pending" as const
      }
    ]
  },
  {
    agentId: "agent2",
    agentName: "David Lee",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    totalCommission: 45000,
    pendingCommission: 0,
    paidCommission: 45000,
    bookingsCount: 2,
    lastBookingDate: "2023-10-20",
    bookings: [
      {
        id: "booking4",
        hostelName: "Green Haven Hostel",
        roomNumber: "102",
        studentName: "Emma Wilson",
        bookingDate: "2023-09-15",
        amount: 180000,
        commissionAmount: 18000,
        commissionStatus: "paid" as const
      },
      {
        id: "booking5",
        hostelName: "Campus View Hostel",
        roomNumber: "307",
        studentName: "Robert Garcia",
        bookingDate: "2023-10-20",
        amount: 270000,
        commissionAmount: 27000,
        commissionStatus: "paid" as const
      }
    ]
  },
  {
    agentId: "agent3",
    agentName: "Michelle Wong",
    profileImage: "https://randomuser.me/api/portraits/women/63.jpg",
    totalCommission: 34000,
    pendingCommission: 34000,
    paidCommission: 0,
    bookingsCount: 1,
    lastBookingDate: "2023-11-28",
    bookings: [
      {
        id: "booking6",
        hostelName: "Sunshine Towers",
        roomNumber: "205",
        studentName: "Daniel Martinez",
        bookingDate: "2023-11-28",
        amount: 340000,
        commissionAmount: 34000,
        commissionStatus: "pending" as const
      }
    ]
  }
];

const PropertiesPage = () => {
  // Property tabs are controlled by @headlessui/react Tab component
  // so we don't need to maintain selected state manually
  
  // In a real app, this would come from API calls
  const properties = [
    { id: "property1", name: "Green Haven Hostel", location: "University of Lagos, Akoka" },
    { id: "property2", name: "Sunshine Towers", location: "University of Ibadan, Ibadan" },
    { id: "property3", name: "Campus View Hostel", location: "Obafemi Awolowo University, Ile-Ife" }
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="properties-title">Property Management</h1>
        <p className="text-gray-600">Manage your hostels, track room occupancy, and monitor agent commissions.</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Your Properties</h2>
            <button 
              className="text-sm bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              data-testid="add-property-button"
              aria-label="Add new property"
            >
              <i className="fas fa-plus mr-2" aria-hidden="true"></i> Add Property
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <Tab.Group>
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
                >
                  <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                      </div>
                      <div className="mt-4 md:mt-0 space-x-2">
                        <button 
                          className="text-sm bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-50 transition-colors"
                          data-testid={`edit-property-${property.id}`}
                        >
                          <i className="fas fa-edit mr-1" aria-hidden="true"></i> Edit
                        </button>
                        <button 
                          className="text-sm bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-50 transition-colors"
                          data-testid={`view-details-${property.id}`}
                        >
                          <i className="fas fa-eye mr-1" aria-hidden="true"></i> Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Room occupancy for the selected property */}
                  <div className="mb-8">
                    <RoomOccupancy 
                      hostelName={property.name}
                      rooms={mockRoomData}
                      testId={`room-occupancy-${property.id}`}
                    />
                  </div>

                  {/* Agent commissions for the selected property */}
                  <div className="mb-4">
                    <AgentCommissions 
                      agents={mockAgentData}
                      testId={`agent-commissions-${property.id}`}
                    />
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;