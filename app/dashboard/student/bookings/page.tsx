"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { FiClock, FiCheckCircle, FiAlertCircle, FiDownload, FiExternalLink } from "react-icons/fi";

interface Booking {
  id: string;
  hostelName: string;
  hostelId: string;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  amount: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingDate: Date;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
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

        // In a real implementation, we would fetch bookings from Firebase
        // For now, using mock data
        const mockBookings: Booking[] = [
          {
            id: 'bk-001',
            hostelName: 'Unilag Female Hostel',
            hostelId: '1',
            roomType: 'Single Room',
            checkInDate: new Date('2023-09-01'),
            checkOutDate: new Date('2024-07-31'),
            status: 'active',
            amount: '₦180,000',
            paymentStatus: 'paid',
            bookingDate: new Date('2023-08-15')
          },
          {
            id: 'bk-002',
            hostelName: 'LASU Exclusive Male Hostel',
            hostelId: '2',
            roomType: 'Double Room',
            checkInDate: new Date('2024-09-01'),
            checkOutDate: new Date('2025-07-31'),
            status: 'upcoming',
            amount: '₦150,000',
            paymentStatus: 'pending',
            bookingDate: new Date('2024-05-20')
          },
          {
            id: 'bk-003',
            hostelName: 'OAU Campus Lodge',
            hostelId: '4',
            roomType: 'Single Room',
            checkInDate: new Date('2022-09-01'),
            checkOutDate: new Date('2023-07-31'),
            status: 'completed',
            amount: '₦130,000',
            paymentStatus: 'paid',
            bookingDate: new Date('2022-08-10')
          }
        ];

        setBookings(mockBookings);
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm flex items-center">
            <FiCheckCircle className="mr-1" />
            Active
          </span>
        );
      case 'upcoming':
        return (
          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm flex items-center">
            <FiClock className="mr-1" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm flex items-center">
            <FiCheckCircle className="mr-1" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm flex items-center">
            <FiAlertCircle className="mr-1" />
            Cancelled
          </span>
        );
    }
  };

  const getPaymentBadge = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm">
            Failed
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <button
          onClick={() => router.push('/hostels')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Book New Hostel
        </button>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeFilter === 'completed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{booking.hostelName}</h2>
                      <p className="text-gray-600">{booking.roomType}</p>
                    </div>
                    <div className="md:hidden">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booking ID</p>
                      <p className="font-medium">{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booked on</p>
                      <p className="font-medium">{formatDate(booking.bookingDate)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start md:items-end justify-between">
                  <div className="hidden md:block mb-4">
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-xl font-bold">{booking.amount}</p>
                    <div className="mt-2">
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4 flex justify-between flex-wrap gap-2">
                <button 
                  onClick={() => router.push(`/hostels/${booking.hostelId}`)}
                  className="flex items-center text-blue-500 hover:underline"
                >
                  <FiExternalLink className="mr-1" />
                  View Hostel
                </button>
                
                <div className="space-x-2">
                  <button 
                    className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <FiDownload className="inline mr-1" />
                    Receipt
                  </button>
                  
                  {booking.status === 'upcoming' && (
                    <button 
                      className="bg-red-50 text-red-700 border border-red-300 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                  
                  {booking.status === 'active' && (
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Extend Stay
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <FiClock className="text-blue-500" size={24} />
          </div>
          <h2 className="text-xl font-semibold mt-4">No bookings found</h2>
          <p className="text-gray-600 mt-2">
            {activeFilter === 'all' 
              ? "You haven't made any hostel bookings yet."
              : `You don't have any ${activeFilter} bookings.`}
          </p>
          <button
            onClick={() => router.push('/hostels')}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Hostels
          </button>
        </div>
      )}
    </div>
  );
}