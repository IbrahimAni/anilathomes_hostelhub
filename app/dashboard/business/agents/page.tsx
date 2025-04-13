"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { BusinessService } from "@/services/business.service";
import { AgentCommissionData } from "@/types/business";
import Image from "next/image";

export default function BusinessAgentsPage() {
  const [agents, setAgents] = useState<AgentCommissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('commission');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        // Fetch agent commissions data (without a limit to get all agents)
        const agentsData = await BusinessService.getAgentCommissions(100);
        setAgents(agentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, [router]);

  // Handle sorting
  const handleSort = (criteriaName: string) => {
    if (sortBy === criteriaName) {
      // If already sorting by this criteria, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New criteria, set it and default to descending
      setSortBy(criteriaName);
      setSortDirection('desc');
    }
  };

  // Toggle expanded view for an agent
  const toggleAgentExpand = (agentId: string) => {
    if (expandedAgents.includes(agentId)) {
      setExpandedAgents(expandedAgents.filter(id => id !== agentId));
    } else {
      setExpandedAgents([...expandedAgents, agentId]);
    }
  };

  // Sort agents based on current criteria
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

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div data-testid="business-agents-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Management</h1>
        <p className="text-gray-600">Manage your agents and their commission payments.</p>
      </div>

      {/* Agent Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
          <h2 className="text-sm font-medium text-gray-500">Total Agents</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">{agents.length}</p>
          <div className="mt-2 text-xs text-indigo-600">
            Active agents who refer bookings
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
          <h2 className="text-sm font-medium text-gray-500">Total Commissions Paid</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(agents.reduce((sum, agent) => sum + agent.paidCommission, 0))}
          </p>
          <div className="mt-2 text-xs text-green-600">
            Commissions already paid out
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
          <h2 className="text-sm font-medium text-gray-500">Pending Commissions</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(agents.reduce((sum, agent) => sum + agent.pendingCommission, 0))}
          </p>
          <div className="mt-2 text-xs text-amber-600">
            Commissions waiting to be paid
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Agent Commission Tracking</h2>
            <button 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              data-testid="add-agent-button"
            >
              Add New Agent
            </button>
          </div>
        </div>

        {agents.length > 0 ? (
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
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
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
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
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
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
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
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden">
                            <Image
                              src={agent.profileImage}
                              alt={agent.agentName}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                            <div className="text-xs text-gray-500">Agent ID: {agent.agentId.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{formatCurrency(agent.totalCommission)}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(agent.paidCommission)} paid
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.bookingsCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-600 font-medium">{formatCurrency(agent.pendingCommission)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.lastBookingDate}</div>
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
                          className={`text-indigo-600 hover:text-indigo-900 ${agent.pendingCommission === 0 && 'opacity-50 cursor-not-allowed'}`}
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
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Bookings by {agent.agentName}</h4>
                            {agent.bookings.length > 0 ? (
                              <div className="bg-white shadow-sm rounded-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Property
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Commission
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {agent.bookings.map((booking) => (
                                      <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                          {booking.studentName}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                          {booking.hostelName} - Room {booking.roomNumber}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                          {booking.bookingDate}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                          {formatCurrency(booking.amount)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-green-600 font-medium">
                                          {formatCurrency(booking.commissionAmount)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs">
                                          <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
                                            booking.commissionStatus === 'paid' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {booking.commissionStatus === 'paid' ? 'Paid' : 'Pending'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No bookings found for this agent.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You currently don&apos;t have any agents referring bookings.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New Agent
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}