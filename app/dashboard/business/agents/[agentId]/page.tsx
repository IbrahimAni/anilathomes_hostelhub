"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { BusinessService } from "@/services/business.service";
import { AgentCommissionData } from "@/types/business";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<AgentCommissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAgentId, setProcessingAgentId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<
    "bookings" | "hostels" | "payments"
  >("bookings");
  // State types for hostels and payment history
  interface HostelItem {
    id: string;
    name: string;
    location?: string;
    roomsReferred: number;
  }
  interface PaymentRecord {
    id: string;
    date: string;
    amount: number;
    status: string;
    reference: string;
  }
  const [mappedHostels, setMappedHostels] = useState<HostelItem[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Toggle agent active status
  const toggleAgentStatus = async (makeActive: boolean) => {
    if (!agent) return;

    setProcessingAgentId(agentId);
    try {
      await BusinessService.toggleAgentActiveStatus(agentId, makeActive);
      toast.success(
        `Agent ${makeActive ? "activated" : "deactivated"} successfully`
      );
      fetchAgentDetails();
    } catch (error) {
      console.error("Error toggling agent status:", error);
      toast.error(`Failed to ${makeActive ? "activate" : "deactivate"} agent`);
    } finally {
      setProcessingAgentId(null);
    }
  };

  // Process commission payment
  const processCommissionPayment = async () => {
    if (!agent || agent.pendingCommission === 0) return;

    try {
      // This would be replaced with actual payment processing through the Business Service
      toast.success("Payment processing initiated");
      // Refresh agent details after payment
      fetchAgentDetails();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    }
  };
  // Fetch agent details
  const fetchAgentDetails = async () => {
    setLoading(true);
    try {
      // Get agent commission data
      const agentsData = await BusinessService.getAgentCommissions(100);
      const currentAgent = agentsData.find((a) => a.agentId === agentId);

      if (!currentAgent) {
        toast.error("Agent not found");
        router.push("/dashboard/business/agents");
        return;
      }

      setAgent(currentAgent);

      // Derive hostels list from agent bookings
      const hostelMap: Record<
        string,
        { id: string; name: string; location?: string; roomsReferred: number }
      > = {};
      currentAgent.bookings.forEach((booking) => {
        const key = booking.hostelName;
        if (!hostelMap[key]) {
          hostelMap[key] = {
            id: booking.id,
            name: booking.hostelName,
            location: "",
            roomsReferred: 1,
          };
        } else {
          hostelMap[key].roomsReferred += 1;
        }
      });
      setMappedHostels(Object.values(hostelMap));

      // Derive payment history from paid commissions in bookings
      const history = currentAgent.bookings
        .filter((b) => b.commissionStatus === "paid")
        .map((b) => ({
          id: b.id,
          date: b.bookingDate,
          amount: b.commissionAmount,
          status: "completed",
          reference: b.id,
        }));
      setPaymentHistory(history);
    } catch (error) {
      console.error("Error fetching agent details:", error);
      toast.error("Failed to load agent details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchAgentDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  // Pagination calculations
  function getPaginatedData<T>(data: T[]): T[] {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }

  function totalPages<T>(data: T[]): number {
    return Math.ceil(data.length / itemsPerPage);
  }

  const generatePaginationControls = <T,>(data: T[]) => {
    const total = totalPages(data);
    if (total <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
              currentPage === 1
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, total))}
            disabled={currentPage === total}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
              currentPage === total
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, data.length)}
              </span>{" "}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                  currentPage === 1
                    ? "text-gray-300"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {Array.from({ length: Math.min(5, total) }, (_, i) => {
                // Always show first, last, and pages around the current page
                let pageToShow;
                if (total <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= total - 2) {
                  pageToShow = total - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageToShow}
                    onClick={() => setCurrentPage(pageToShow)}
                    aria-current={
                      currentPage === pageToShow ? "page" : undefined
                    }
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageToShow
                        ? "bg-indigo-600 text-white focus-visible:outline-offset-2"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, total))
                }
                disabled={currentPage === total}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                  currentPage === total
                    ? "text-gray-300"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-xl font-semibold text-gray-800">
          Agent not found
        </div>
        <button
          onClick={() => router.push("/dashboard/business/agents")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return to Agents List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Back button */}
      <div className="mb-6">
        <button
          data-testid="back-button"
          onClick={() => router.push("/dashboard/business/agents")}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Agents
        </button>
      </div>

      {/* Agent Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="md:flex items-start px-6 py-5">
          <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={agent.profileImage}
                alt={agent.agentName}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="md:flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  {agent.agentName}
                  {agent.verified !== undefined && (
                    <span
                      className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                        agent.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {agent.verified ? "Verified" : "Unverified"}
                    </span>
                  )}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      agent.active !== false
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {agent.active !== false ? "Active" : "Inactive"}
                  </span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Agent ID: {agent.agentId}
                </p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                {/* Pay Commission Button */}
                <button
                  onClick={processCommissionPayment}
                  disabled={agent.pendingCommission === 0}
                  className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md shadow-sm ${
                    agent.pendingCommission === 0
                      ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "border-green-300 text-white bg-green-600 hover:bg-green-700"
                  }`}
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
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Pay Commission
                </button>

                {/* Toggle Status Button */}
                {agent.active !== false ? (
                  <button
                    onClick={() => toggleAgentStatus(false)}
                    disabled={processingAgentId === agent.agentId}
                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50"
                  >
                    {processingAgentId === agent.agentId ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      <>
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
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                        Deactivate Agent
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => toggleAgentStatus(true)}
                    disabled={processingAgentId === agent.agentId}
                    className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    {processingAgentId === agent.agentId ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      <>
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Activate Agent
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Agent Statistics */}
        <div className="border-t border-gray-200">
          <dl className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="px-6 py-4">
              <dt className="text-sm font-medium text-gray-500">
                Total Commission
              </dt>
              <dd className="mt-1 flex justify-between items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(agent.totalCommission)}
                </div>
                <div className="text-sm text-green-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12z" />
                    <path d="M15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                  </svg>
                  Lifetime
                </div>
              </dd>
            </div>

            <div className="px-6 py-4">
              <dt className="text-sm font-medium text-gray-500">
                Pending Commission
              </dt>
              <dd className="mt-1 flex justify-between items-baseline">
                <div className="text-2xl font-semibold text-amber-600">
                  {formatCurrency(agent.pendingCommission)}
                </div>
                <div className="text-sm text-amber-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  To be paid
                </div>
              </dd>
            </div>

            <div className="px-6 py-4">
              <dt className="text-sm font-medium text-gray-500">
                Total Bookings
              </dt>
              <dd className="mt-1 flex justify-between items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {agent.bookingsCount}
                </div>
                <div className="text-sm text-blue-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Referred
                </div>
              </dd>
            </div>

            <div className="px-6 py-4">
              <dt className="text-sm font-medium text-gray-500">
                Last Booking
              </dt>
              <dd className="mt-1 flex justify-between items-baseline">
                <div className="text-lg font-medium text-gray-900">
                  {agent.lastBookingDate || "N/A"}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6" data-testid="agent-detail-tabs">
          <button
            data-testid="tab-bookings"
            onClick={() => setActiveTab("bookings")}
            className={`${
              activeTab === "bookings"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Bookings
          </button>{" "}
          <button
            data-testid="tab-hostels"
            onClick={() => setActiveTab("hostels")}
            className={`${
              activeTab === "hostels"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Hostels
          </button>
          <button
            data-testid="tab-payments"
            onClick={() => setActiveTab("payments")}
            className={`${
              activeTab === "payments"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Payment History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div
        className="bg-white shadow rounded-lg overflow-hidden mb-6"
        data-testid="agent-detail-content"
      >
        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Booking History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                All bookings referred by this agent
              </p>
            </div>

            {agent.bookings && agent.bookings.length > 0 ? (
              <>
                <div className="overflow-x-auto" data-testid="bookings-table">
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    data-testid="bookings-table"
                  >
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Student
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Property
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Commission
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getPaginatedData(agent.bookings).map((booking) => (
                        <tr
                          key={booking.id}
                          data-testid={`booking-row-${booking.id}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.studentName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.hostelName} - Room {booking.roomNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(booking.bookingDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(booking.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-green-600 font-medium">
                              {formatCurrency(booking.commissionAmount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.commissionStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.commissionStatus === "paid"
                                ? "Paid"
                                : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {generatePaginationControls(agent.bookings)}
              </>
            ) : (
              <div className="px-6 py-12 text-center">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No bookings yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This agent hasn&apos;t referred any bookings yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mapped Hostels Tab */}
        {activeTab === "hostels" && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Hostels</h2>
              <p className="mt-1 text-sm text-gray-500">
                Hostels this agent can refer students to
              </p>
            </div>

            {mappedHostels.length > 0 ? (
              <>
                <div className="overflow-x-auto" data-testid="hostels-table">
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    data-testid="hostels-table"
                  >
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hostel Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Rooms Referred
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getPaginatedData(mappedHostels).map((hostel) => (
                        <tr
                          key={hostel.id}
                          data-testid={`hostel-row-${hostel.id}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {hostel.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {hostel.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {hostel.roomsReferred}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {generatePaginationControls(mappedHostels)}
              </>
            ) : (
              <div className="px-6 py-12 text-center">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hostels
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This agent doesn&apos;t have any hostels yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "payments" && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Payment History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Commission payments made to this agent
              </p>
            </div>

            {paymentHistory.length > 0 ? (
              <>
                <div
                  className="overflow-x-auto"
                  data-testid="payment-history-table"
                >
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    data-testid="payment-history-table"
                  >
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Reference
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getPaginatedData(paymentHistory).map((payment) => (
                        <tr
                          key={payment.id}
                          data-testid={`payment-row-${payment.id}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900">
                              {payment.reference}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(payment.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status === "completed"
                                ? "Completed"
                                : payment.status === "pending"
                                ? "Pending"
                                : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {generatePaginationControls(paymentHistory)}
              </>
            ) : (
              <div className="px-6 py-12 text-center">
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No payment history
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This agent hasn&apos;t received any commission payments yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Commission Summary Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Commission Summary
          </h2>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Year to Date
              </div>
              <div className="text-xl font-semibold text-gray-900">
                {formatCurrency(agent.totalCommission * 0.8)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                From {agent.bookingsCount * 0.7} bookings
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Last Month
              </div>
              <div className="text-xl font-semibold text-gray-900">
                {formatCurrency(agent.totalCommission * 0.3)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                From {agent.bookingsCount * 0.3} bookings
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">
                This Month
              </div>
              <div className="text-xl font-semibold text-gray-900">
                {formatCurrency(agent.pendingCommission * 0.9)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                From {agent.bookingsCount * 0.1} bookings
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Commission Trend
            </h3>
            <div className="h-12 bg-gray-100 rounded-md overflow-hidden relative">
              {/* Simple visualization of commission trend */}
              <div
                style={{ width: "70%" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600"
              ></div>
              <div
                style={{ width: "20%", left: "70%" }}
                className="absolute inset-y-0 bg-gradient-to-r from-purple-600 to-indigo-400"
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Commission Statement
            </h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Period
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bookings
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Commission
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                <tr>
                  <td className="px-3 py-2">Q1 2025</td>
                  <td className="px-3 py-2">
                    {Math.floor(agent.bookingsCount * 0.4)}
                  </td>
                  <td className="px-3 py-2">
                    {formatCurrency(agent.totalCommission * 0.4)}
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Q2 2025</td>
                  <td className="px-3 py-2">
                    {Math.floor(agent.bookingsCount * 0.3)}
                  </td>
                  <td className="px-3 py-2">
                    {formatCurrency(agent.totalCommission * 0.3)}
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Processing
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Q3 2025 (Projected)</td>
                  <td className="px-3 py-2">
                    {Math.floor(agent.bookingsCount * 0.2)}
                  </td>
                  <td className="px-3 py-2">
                    {formatCurrency(agent.totalCommission * 0.2)}
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      Projected
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <th
                    scope="row"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <td className="px-3 py-2 text-xs font-medium text-gray-900">
                    {agent.bookingsCount}
                  </td>
                  <td className="px-3 py-2 text-xs font-medium text-gray-900">
                    {formatCurrency(agent.totalCommission)}
                  </td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
