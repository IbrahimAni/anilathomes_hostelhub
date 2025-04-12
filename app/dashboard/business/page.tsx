"use client";

import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BusinessDashboardPage() {
  // Revenue statistics
  const [revenueStats] = useState({
    totalRevenue: "₦4,250,000",
    pendingPayments: "₦650,000",
    projectedRevenue: "₦5,000,000",
  });

  // Booking statistics
  const [bookingStats] = useState({
    totalBookings: 32,
    pendingRequests: 7,
    confirmedBookings: 25,
  });

  // Chart data
  const [occupancyChartData] = useState({
    labels: ["Occupied", "Vacant"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#4F46E5", "#E5E7EB"],
        borderColor: ["#4F46E5", "#E5E7EB"],
        borderWidth: 1,
      },
    ],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Revenue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">{revenueStats.totalRevenue}</p>
          <div className="mt-2 text-xs text-green-600">
            <span className="inline-block mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0112 7z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            8.2% from last year
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Pending Payments</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">{revenueStats.pendingPayments}</p>
          <div className="mt-2 text-xs text-amber-600">
            <span className="inline-block mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            15% of total expected
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Projected Annual Revenue</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">{revenueStats.projectedRevenue}</p>
          <div className="mt-2 text-xs text-indigo-600">
            Based on current occupancy rate
          </div>
        </div>
      </div>

      {/* Occupancy and Booking Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Room Occupancy</h2>
          <div className="flex justify-center">
            <div className="w-48 h-48">
              <Doughnut
                data={occupancyChartData}
                options={{
                  cutout: "70%",
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="bg-indigo-50 p-2 rounded">
              <p className="text-sm font-medium text-gray-500">Occupied</p>
              <p className="text-xl font-semibold text-indigo-600">75%</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm font-medium text-gray-500">Vacant</p>
              <p className="text-xl font-semibold text-gray-600">25%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{bookingStats.totalBookings}</p>
              <p className="text-xs text-gray-500 mt-1">For academic year 2024/2025</p>
            </div>
            <div className="bg-amber-50 p-4 rounded">
              <h3 className="text-sm font-medium text-amber-800">Pending Requests</h3>
              <p className="text-2xl font-bold text-amber-700 mt-1">{bookingStats.pendingRequests}</p>
              <p className="text-xs text-amber-600 mt-1">Requires your attention</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="text-sm font-medium text-green-800">Confirmed Bookings</h3>
              <p className="text-2xl font-bold text-green-700 mt-1">{bookingStats.confirmedBookings}</p>
              <p className="text-xs text-green-600 mt-1">Successfully processed</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      student: "Amara Okafor",
                      property: "Green Meadows",
                      roomType: "Single Room",
                      status: "Confirmed",
                    },
                    {
                      student: "Chidi Nwosu",
                      property: "Sunlight Hostel",
                      roomType: "Shared Room",
                      status: "Pending",
                    },
                    {
                      student: "Blessing Ade",
                      property: "Green Meadows",
                      roomType: "Ensuite",
                      status: "Confirmed",
                    },
                  ].map((booking, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {booking.student}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {booking.property}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {booking.roomType}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        {booking.status === "Confirmed" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-800">Add New Property</h3>
            <p className="text-xs text-indigo-600 mt-1">
              Expand your property portfolio
            </p>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">Process Payments</h3>
            <p className="text-xs text-green-600 mt-1">Review pending payments</p>
          </div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-center">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800">Booking Requests</h3>
            <p className="text-xs text-amber-600 mt-1">
              {bookingStats.pendingRequests} pending requests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}