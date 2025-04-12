"use client";

import React, { useState } from 'react';
import { RoomData } from '@/types/business';

interface RoomOccupancyProps {
  hostelName: string;
  rooms: RoomData[];
  testId?: string;
}

const RoomOccupancy: React.FC<RoomOccupancyProps> = ({ 
  hostelName, 
  rooms, 
  testId 
}) => {
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'vacant' | 'occupied' | 'expiring'>('all');

  const toggleRoomExpand = (roomId: string) => {
    setExpandedRooms(prev => 
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLeaseExpiringSoon = (leaseEnd: string) => {
    const today = new Date();
    const endDate = new Date(leaseEnd);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'vacant') return room.occupiedCount < room.capacity;
    if (filter === 'occupied') return room.occupiedCount === room.capacity;
    if (filter === 'expiring') {
      return room.occupants.some(occupant => isLeaseExpiringSoon(occupant.leaseEnd));
    }
    return true;
  });

  const vacantRoomsCount = rooms.filter(room => room.occupiedCount < room.capacity).length;
  const occupiedRoomsCount = rooms.filter(room => room.occupiedCount === room.capacity).length;
  const expiringLeasesCount = rooms.filter(room => 
    room.occupants.some(occupant => isLeaseExpiringSoon(occupant.leaseEnd))
  ).length;

  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden"
      data-testid={testId || "room-occupancy-component"}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{hostelName} - Room Occupancy</h2>
        <p className="text-sm text-gray-500 mt-1">
          Managing {rooms.length} rooms with {vacantRoomsCount} vacant and {occupiedRoomsCount} fully occupied
        </p>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            data-testid="filter-all-button"
          >
            All Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setFilter('vacant')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'vacant' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            data-testid="filter-vacant-button"
          >
            Vacant ({vacantRoomsCount})
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'occupied' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            data-testid="filter-occupied-button"
          >
            Fully Occupied ({occupiedRoomsCount})
          </button>
          <button
            onClick={() => setFilter('expiring')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'expiring' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            data-testid="filter-expiring-button"
          >
            Expiring Leases ({expiringLeasesCount})
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <div key={room.roomId} className="bg-white hover:bg-gray-50 transition-colors">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleRoomExpand(room.roomId)}
                aria-expanded={expandedRooms.includes(room.roomId)}
                data-testid={`room-header-${room.roomId}`}
              >
                <div>
                  <div className="font-medium">Room {room.roomNumber} - {room.roomType}</div>
                  <div className="text-sm text-gray-500">
                    Occupancy: {room.occupiedCount}/{room.capacity}
                  </div>
                </div>

                <div className="flex items-center">
                  {room.occupiedCount === 0 && (
                    <span className="px-2 py-1 mr-2 text-xs bg-green-100 text-green-800 rounded-full">
                      Vacant
                    </span>
                  )}
                  {room.occupiedCount === room.capacity && (
                    <span className="px-2 py-1 mr-2 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Full
                    </span>
                  )}
                  {room.occupiedCount > 0 && room.occupiedCount < room.capacity && (
                    <span className="px-2 py-1 mr-2 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Partially Occupied
                    </span>
                  )}
                  <i className={`fas fa-chevron-${expandedRooms.includes(room.roomId) ? 'up' : 'down'} text-gray-500`} aria-hidden="true"></i>
                </div>
              </div>

              {expandedRooms.includes(room.roomId) && (
                <div className="px-4 pb-4 pt-2" data-testid={`room-details-${room.roomId}`}>
                  {room.occupants.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Occupants</h4>
                      <div className="space-y-3">
                        {room.occupants.map(occupant => (
                          <div key={occupant.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{occupant.name}</div>
                                <div className="text-sm text-gray-500">
                                  Lease ends: <span className={
                                    isLeaseExpiringSoon(occupant.leaseEnd) ? 'text-yellow-600 font-medium' : ''
                                  }>
                                    {new Date(occupant.leaseEnd).toLocaleDateString()}
                                  </span>
                                  {isLeaseExpiringSoon(occupant.leaseEnd) && (
                                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                                      Expiring soon
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(occupant.paymentStatus)}`}>
                                {occupant.paymentStatus.charAt(0).toUpperCase() + occupant.paymentStatus.slice(1)}
                              </span>
                            </div>
                            
                            {occupant.agentAssisted && (
                              <div className="mt-2 text-xs text-gray-600 flex items-center">
                                <i className="fas fa-user-tie mr-1" aria-hidden="true"></i>
                                Assisted by agent: {occupant.agentName}
                              </div>
                            )}
                            
                            <div className="mt-2 flex justify-end space-x-2">
                              <button 
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                aria-label={`View payment history for ${occupant.name}`}
                                data-testid={`view-payments-${occupant.id}`}
                              >
                                <i className="fas fa-file-invoice-dollar mr-1" aria-hidden="true"></i>
                                Payments
                              </button>
                              <button 
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                aria-label={`View details for ${occupant.name}`}
                                data-testid={`view-details-${occupant.id}`}
                              >
                                <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                                Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3 text-gray-500">
                      No occupants in this room
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No rooms match your filter criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomOccupancy;