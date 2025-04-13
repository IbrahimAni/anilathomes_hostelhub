"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { BusinessService } from "@/services/business.service";
import { BookingData } from "@/types/business";

export default function BusinessBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        // Fetch all bookings (not just recent ones, so we're using a higher limit)
        const bookingsData = await BusinessService.getRecentBookings(50);
        setBookings(bookingsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div data-testid="business-bookings-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h1>
        <p className="text-gray-600">View and manage all your property bookings in one place.</p>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-sm rounded-lg ${
              activeFilter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="filter-all-button"
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-4 py-2 text-sm rounded-lg ${
              activeFilter === 'confirmed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="filter-confirmed-button"
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 text-sm rounded-lg ${
              activeFilter === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="filter-pending-button"
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('cancelled')}
            className={`px-4 py-2 text-sm rounded-lg ${
              activeFilter === 'cancelled' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="filter-cancelled-button"
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
            {filteredBookings.length > 0 && (
              <span className="text-sm text-gray-500">
                Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
              </span>
            )}
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.hostelName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{booking.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₦{booking.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        data-testid={`view-details-${booking.id}`}
                      >
                        Details
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-900 mr-4"
                            data-testid={`confirm-${booking.id}`}
                          >
                            Confirm
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            data-testid={`cancel-${booking.id}`}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === 'all' 
                ? "You don't have any bookings yet." 
                : `You don't have any ${activeFilter} bookings.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}