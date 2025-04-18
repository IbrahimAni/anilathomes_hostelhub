"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BusinessService } from "@/services/business.service";
import { AgentCommissionData } from "@/types/business";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function BusinessAgentsPage() {
  const [agents, setAgents] = useState<AgentCommissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("commission");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");
  const [newAgentPhone, setNewAgentPhone] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [showUnverified, setShowUnverified] = useState(false);
  const [processingAgentId, setProcessingAgentId] = useState<string | null>(
    null
  );

  const router = useRouter();

  // move fetch logic into a named function
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await BusinessService.getAgentCommissions(100);
      setAgents(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Toggle agent active status
  const toggleAgentStatus = async (agentId: string, makeActive: boolean) => {
    setProcessingAgentId(agentId);
    try {
      await BusinessService.toggleAgentActiveStatus(agentId, makeActive);
      toast.success(
        `Agent ${makeActive ? "activated" : "deactivated"} successfully`
      );
      await fetchAgents();
    } catch (error) {
      console.error("Error toggling agent status:", error);
      toast.error(`Failed to ${makeActive ? "activate" : "deactivate"} agent`);
    } finally {
      setProcessingAgentId(null);
    }
  };
  // Filter agents based on active and verification status
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // Handle inactive filter
      const passesActiveFilter = showInactive ? true : agent.active !== false;
      
      // Handle unverified filter
      const passesVerifiedFilter = showUnverified ? true : agent.verified !== false;
      
      return passesActiveFilter && passesVerifiedFilter;
    });
  }, [agents, showInactive, showUnverified]);

  useEffect(() => {
    fetchAgents();
  }, [router]);
  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      phone: "",
    };

    // Name validation
    if (!newAgentName.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (newAgentName.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (!newAgentEmail.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newAgentEmail)
    ) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation (optional but must be valid if provided)
    if (
      newAgentPhone.trim() &&
      !/^(\+\d{1,3})?\s?\d{10,14}$/.test(newAgentPhone)
    ) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle input change with validation
  const handleInputChange = (
    field: "name" | "email" | "phone",
    value: string
  ) => {
    switch (field) {
      case "name":
        setNewAgentName(value);
        if (formErrors.name && value.trim().length >= 3) {
          setFormErrors({ ...formErrors, name: "" });
        }
        break;
      case "email":
        setNewAgentEmail(value);
        if (
          formErrors.email &&
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ) {
          setFormErrors({ ...formErrors, email: "" });
        }
        break;
      case "phone":
        setNewAgentPhone(value);
        if (
          formErrors.phone &&
          (!value.trim() || /^(\+\d{1,3})?\s?\d{10,14}$/.test(value))
        ) {
          setFormErrors({ ...formErrors, phone: "" });
        }
        break;
    }
  };
  const handleAddAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      e.stopPropagation();
      return;
    }
    setIsSubmitting(true);
    try {
      await BusinessService.addAgent({
        displayName: newAgentName,
        email: newAgentEmail,
        phone: newAgentPhone,
      });
      await fetchAgents();
      setIsDrawerOpen(false);
      setNewAgentName("");
      setNewAgentEmail("");
      setNewAgentPhone("");
      setFormErrors({ name: "", email: "", phone: "" });
      toast.success(
        "Agent added successfully! They will need to complete their profile to be verified."
      );
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error("Failed to add agent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sorting
  const handleSort = (criteriaName: string) => {
    if (sortBy === criteriaName) {
      // If already sorting by this criteria, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New criteria, set it and default to descending
      setSortBy(criteriaName);
      setSortDirection("desc");
    }
  };

  // Toggle expanded view for an agent
  const toggleAgentExpand = (agentId: string) => {
    if (expandedAgents.includes(agentId)) {
      setExpandedAgents(expandedAgents.filter((id) => id !== agentId));
    } else {
      setExpandedAgents([...expandedAgents, agentId]);
    }
  }; // Sort agents based on current criteria
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc"
        ? a.agentName.localeCompare(b.agentName)
        : b.agentName.localeCompare(a.agentName);
    } else if (sortBy === "commission") {
      return sortDirection === "asc"
        ? a.totalCommission - b.totalCommission
        : b.totalCommission - a.totalCommission;
    } else if (sortBy === "status") {
      // Sort by active status (active first by default)
      const aValue = a.active !== false;
      const bValue = b.active !== false;
      return sortDirection === "asc"
        ? aValue === bValue
          ? 0
          : aValue
          ? 1
          : -1
        : aValue === bValue
        ? 0
        : aValue
        ? -1
        : 1;
    } else {
      // bookings
      return sortDirection === "asc"
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
    <>
      <div data-testid="business-agents-page">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Agent Management
          </h1>
          <p className="text-gray-600">
            Manage your agents and their commission payments.
          </p>
        </div>

        {/* Agent Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
            <h2 className="text-sm font-medium text-gray-500">Total Agents</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {agents.length}
            </p>
            <div className="mt-2 text-xs text-indigo-600">
              Active agents who refer bookings
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
            <h2 className="text-sm font-medium text-gray-500">
              Total Commissions Paid
            </h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {formatCurrency(
                agents.reduce((sum, agent) => sum + agent.paidCommission, 0)
              )}
            </p>
            <div className="mt-2 text-xs text-green-600">
              Commissions already paid out
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
            <h2 className="text-sm font-medium text-gray-500">
              Pending Commissions
            </h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {formatCurrency(
                agents.reduce((sum, agent) => sum + agent.pendingCommission, 0)
              )}
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
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Agent Commission Tracking
                </h2>
                <div className="flex items-center space-x-4 ml-4 border-l border-gray-200 pl-4">
                  {/* Inactive agents toggle with improved styling */}
                  <label className="inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showInactive}
                      onChange={() => setShowInactive(!showInactive)}
                      className="sr-only peer"
                      data-testid="show-inactive-toggle"
                    />
                    <div className="relative w-10 h-5 bg-gray-200 rounded-full peer 
                      peer-focus:ring-3 peer-focus:ring-indigo-300
                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600
                      group-hover:after:scale-95 group-hover:bg-gray-300 peer-checked:group-hover:bg-indigo-500
                      shadow-inner"></div>
                    <span className="ml-2 text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                      Inactive
                    </span>
                  </label>
                  
                  {/* Unverified agents toggle */}
                  <label className="inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showUnverified}
                      onChange={() => setShowUnverified(!showUnverified)}
                      className="sr-only peer"
                      data-testid="show-unverified-toggle"
                    />
                    <div className="relative w-10 h-5 bg-gray-200 rounded-full peer 
                      peer-focus:ring-3 peer-focus:ring-amber-300
                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500
                      group-hover:after:scale-95 group-hover:bg-gray-300 peer-checked:group-hover:bg-amber-400
                      shadow-inner"></div>
                    <span className="ml-2 text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                      Unverified
                    </span>
                  </label>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                data-testid="add-agent-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
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
                      onClick={() => handleSort("name")}
                      data-testid="sort-by-name"
                    >
                      <div className="flex items-center">
                        Agent Name
                        {sortBy === "name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                      data-testid="sort-by-status"
                    >
                      <div className="flex items-center">
                        Status
                        {sortBy === "status" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("commission")}
                      data-testid="sort-by-commission"
                    >
                      <div className="flex items-center">
                        Total Commission
                        {sortBy === "commission" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("bookings")}
                      data-testid="sort-by-bookings"
                    >
                      <div className="flex items-center">
                        Bookings
                        {sortBy === "bookings" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-lFeft text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pending
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Booking
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
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
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {agent.agentName}
                                {agent.verified !== undefined && (
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                      agent.verified
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                    data-testid={`verification-status-${agent.agentId}`}
                                  >
                                    {agent.verified ? "Verified" : "Unverified"}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Agent ID: {agent.agentId.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              agent.active !== false
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                            data-testid={`active-status-${agent.agentId}`}
                          >
                            {agent.active !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {formatCurrency(agent.totalCommission)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(agent.paidCommission)} paid
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {agent.bookingsCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-amber-600 font-medium">
                            {formatCurrency(agent.pendingCommission)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {agent.lastBookingDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {/* View/Hide Bookings Button */}
                            <button
                              onClick={() => toggleAgentExpand(agent.agentId)}
                              className={`inline-flex items-center px-2.5 py-1.5 border border-indigo-300 shadow-sm text-xs font-medium rounded text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                                expandedAgents.includes(agent.agentId)
                                  ? "bg-indigo-50"
                                  : ""
                              }`}
                              aria-expanded={expandedAgents.includes(
                                agent.agentId
                              )}
                              data-testid={`toggle-agent-${agent.agentId}`}
                              title={
                                expandedAgents.includes(agent.agentId)
                                  ? "Hide bookings"
                                  : "View bookings"
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {expandedAgents.includes(agent.agentId) ? (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                ) : (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                )}
                              </svg>
                              {expandedAgents.includes(agent.agentId)
                                ? "Hide"
                                : "View"}
                            </button>

                            {/* Pay Commission Button */}
                            <button
                              className={`inline-flex items-center px-2.5 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                                agent.pendingCommission === 0
                                  ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
                                  : "border-green-300 text-green-700 bg-white hover:bg-green-50 focus:ring-green-500"
                              }`}
                              data-testid={`pay-agent-${agent.agentId}`}
                              disabled={agent.pendingCommission === 0}
                              title={
                                agent.pendingCommission === 0
                                  ? "No pending commission"
                                  : "Process commission payment"
                              }
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
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              Pay
                            </button>

                            {/* Activate/Deactivate Button */}
                            {agent.active !== false ? (
                              <button
                                onClick={() =>
                                  toggleAgentStatus(agent.agentId, false)
                                }
                                disabled={processingAgentId === agent.agentId}
                                className={`inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all`}
                                data-testid={`deactivate-agent-${agent.agentId}`}
                                title="Deactivate agent"
                              >
                                {processingAgentId === agent.agentId ? (
                                  <span className="flex items-center">
                                    <svg
                                      className="animate-spin h-4 w-4 mr-1 text-red-600"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 008-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  </span>
                                ) : (
                                  <>
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
                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                      />
                                    </svg>
                                    Off
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  toggleAgentStatus(agent.agentId, true)
                                }
                                disabled={processingAgentId === agent.agentId}
                                className={`inline-flex items-center px-2.5 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all`}
                                data-testid={`activate-agent-${agent.agentId}`}
                                title="Activate agent"
                              >
                                {processingAgentId === agent.agentId ? (
                                  <span className="flex items-center">
                                    <svg
                                      className="animate-spin h-4 w-4 mr-1 text-green-600"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 008-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  </span>
                                ) : (
                                  <>
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    On
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedAgents.includes(agent.agentId) && (
                        <tr data-testid={`agent-bookings-${agent.agentId}`}>
                          <td colSpan={6} className="px-0 py-0 bg-gray-50">
                            <div className="px-6 py-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Bookings by {agent.agentName}
                              </h4>
                              {agent.bookings.length > 0 ? (
                                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th
                                          scope="col"
                                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                          Student
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                          Property
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                          Date
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                          Amount
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                          Commission
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {agent.bookings.map((booking) => (
                                        <tr
                                          key={booking.id}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                            {booking.studentName}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                            {booking.hostelName} - Room{" "}
                                            {booking.roomNumber}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                            {booking.bookingDate}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                            {formatCurrency(booking.amount)}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-green-600 font-medium">
                                            {formatCurrency(
                                              booking.commissionAmount
                                            )}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs">
                                            <span
                                              className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
                                                booking.commissionStatus ===
                                                "paid"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-yellow-100 text-yellow-800"
                                              }`}
                                            >
                                              {booking.commissionStatus ===
                                              "paid"
                                                ? "Paid"
                                                : "Pending"}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No bookings found for this agent.
                                </p>
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No agents found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You currently don&apos;t have any agents referring bookings.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  data-testid="empty-state-add-agent-button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Agent
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Backdrop and Drawer go here as siblings */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsDrawerOpen(false)}
          data-testid="agent-drawer-backdrop"
        />

        {/* Drawer */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-md z-50 transform transition-all duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          data-testid="agent-drawer"
        >
          <div className="h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                Add New Agent
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-testid="agent-drawer-close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6">
              <p className="text-sm text-gray-500 mb-6">
                New agents will need to log in and complete their profile before
                being verified.
              </p>

              <form
                onSubmit={handleAddAgentSubmit}
                className="space-y-5"
                data-testid="add-agent-form"
              >
                {" "}
                <div>
                  <label
                    htmlFor="agent-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="agent-name"
                    type="text"
                    // required
                    value={newAgentName}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="Enter agent's full name"
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    data-testid="agent-name-input"
                    aria-invalid={!!formErrors.name}
                    aria-describedby="name-error"
                  />
                  {formErrors.name && (
                    <p
                      className="mt-1 text-xs text-red-600"
                      id="name-error"
                      data-testid="name-error"
                    >
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="agent-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="agent-email"
                    type="email"
                    // required
                    value={newAgentEmail}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="agent@example.com"
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    data-testid="agent-email-input"
                    aria-invalid={!!formErrors.email}
                    aria-describedby="email-error email-hint"
                  />
                  {formErrors.email ? (
                    <p
                      className="mt-1 text-xs text-red-600"
                      id="email-error"
                      data-testid="email-error"
                    >
                      {formErrors.email}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500" id="email-hint">
                      The agent will use this email to log in
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="agent-phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="agent-phone"
                    type="tel"
                    value={newAgentPhone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="+234 000 000 0000"
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    data-testid="agent-phone-input"
                    aria-invalid={!!formErrors.phone}
                    aria-describedby="phone-error"
                  />
                  {formErrors.phone && (
                    <p
                      className="mt-1 text-xs text-red-600"
                      id="phone-error"
                      data-testid="phone-error"
                    >
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div className="pt-4 border-t border-gray-200 mt-6">
                  <div className="flex flex-col space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      data-testid="agent-submit-button"
                    >
                      {isSubmitting ? 'Submitting...' : 'Add Agent'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      data-testid="agent-cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
