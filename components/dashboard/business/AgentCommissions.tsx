"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AgentCommissionData } from '@/types/business';

interface AgentCommissionsProps {
  agents: AgentCommissionData[];
  testId?: string;
}

const AgentCommissions: React.FC<AgentCommissionsProps> = ({ agents, testId }) => {
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'commission' | 'bookings'>('commission');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleAgentExpand = (agentId: string) => {
    setExpandedAgents(prev => 
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSort = (criteriaName: 'name' | 'commission' | 'bookings') => {
    if (sortBy === criteriaName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteriaName);
      setSortDirection('desc');
    }
  };

  const sortedAgents = [...agents].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.agentName.localeCompare(b.agentName)
        : b.agentName.localeCompare(a.agentName);
    } else if (sortBy === 'commission') {
      return sortDirection === 'asc'
        ? a.totalCommission - b.totalCommission
        : b.totalCommission - a.totalCommission;
    } else { // bookings
      return sortDirection === 'asc'
        ? a.bookingsCount - b.bookingsCount
        : b.bookingsCount - a.bookingsCount;
    }
  });

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden"
      data-testid={testId || "agent-commissions"}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Agent Commissions</h2>
          <button 
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            data-testid="pay-all-commissions"
          >
            Process Pending Commissions
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage commissions for agents who have helped secure bookings
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
                data-testid="sort-by-name"
              >
                <div className="flex items-center">
                  Agent Name
                  {sortBy === 'name' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`} aria-hidden="true"></i>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('commission')}
                data-testid="sort-by-commission"
              >
                <div className="flex items-center">
                  Total Commission
                  {sortBy === 'commission' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`} aria-hidden="true"></i>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('bookings')}
                data-testid="sort-by-bookings"
              >
                <div className="flex items-center">
                  Bookings
                  {sortBy === 'bookings' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`} aria-hidden="true"></i>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Booking
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAgents.map((agent) => (
              <React.Fragment key={agent.agentId}>
                <tr 
                  className={`${expandedAgents.includes(agent.agentId) ? 'bg-indigo-50' : 'hover:bg-gray-50'} transition-colors`}
                  data-testid={`agent-row-${agent.agentId}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          className="rounded-full"
                          src={agent.profileImage}
                          alt={agent.agentName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                        <div className="text-sm text-gray-500">ID: {agent.agentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(agent.totalCommission)}</div>
                    <div className="text-xs text-gray-500">{formatCurrency(agent.paidCommission)} paid</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.bookingsCount} bookings</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {agent.pendingCommission > 0 ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        {formatCurrency(agent.pendingCommission)}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        All Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(agent.lastBookingDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleAgentExpand(agent.agentId)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      aria-expanded={expandedAgents.includes(agent.agentId)}
                      data-testid={`toggle-agent-${agent.agentId}`}
                    >
                      {expandedAgents.includes(agent.agentId) ? 'Hide' : 'View'} Bookings
                    </button>
                    <button 
                      className="text-indigo-600 hover:text-indigo-900"
                      data-testid={`pay-agent-${agent.agentId}`}
                      disabled={agent.pendingCommission === 0}
                    >
                      Pay Commission
                    </button>
                  </td>
                </tr>
                {expandedAgents.includes(agent.agentId) && (
                  <tr data-testid={`agent-bookings-${agent.agentId}`}>
                    <td colSpan={6} className="px-0 py-0 bg-gray-50">
                      <div className="px-6 py-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Bookings by {agent.agentName}</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                              <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Hostel & Room
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Student
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Booking Amount
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Commission
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {agent.bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{booking.hostelName}</div>
                                    <div className="text-xs text-gray-500">Room: {booking.roomNumber}</div>
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {booking.studentName}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(booking.bookingDate)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(booking.amount)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(booking.commissionAmount)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs ${
                                      booking.commissionStatus === 'paid' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    } rounded-full`}>
                                      {booking.commissionStatus.charAt(0).toUpperCase() + booking.commissionStatus.slice(1)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentCommissions;