import React from 'react';
import Link from 'next/link';
import { BookingData } from '@/types/business';

interface RecentBookingsProps {
  bookings: BookingData[];
  testId?: string;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings, testId }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden"
      data-testid={testId || "recent-bookings"}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
          <Link 
            href="/dashboard/business/bookings"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            data-testid="view-all-bookings"
          >
            View all
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto" role="table" aria-label="Recent bookings">
        <div className="hidden md:flex bg-gray-50 py-3 px-6" role="row">
          <div className="w-1/3 text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader">Student</div>
          <div className="w-1/3 text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader">Hostel</div>
          <div className="w-1/6 text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader">Amount</div>
          <div className="w-1/6 text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader">Status</div>
        </div>
        
        {bookings.length === 0 ? (
          <div className="py-8 text-center" role="row">
            <p className="text-gray-500" role="cell">No bookings available</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="flex flex-col md:flex-row py-4 px-6 hover:bg-gray-50 transition-colors"
              role="row"
              data-testid={`booking-${booking.id}`}
            >
              {/* Mobile view */}
              <div className="md:hidden space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-900">{booking.studentName}</div>
                  <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">{booking.hostelName}</div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">{booking.date}</div>
                  <div className="text-sm font-medium text-gray-900">₦{booking.amount.toLocaleString()}</div>
                </div>
              </div>

              {/* Desktop view */}
              <div className="hidden md:block md:w-1/3" role="cell">
                <div className="text-sm font-medium text-gray-900">{booking.studentName}</div>
                <div className="text-sm text-gray-500">{booking.date}</div>
              </div>
              <div className="hidden md:block md:w-1/3 text-sm text-gray-900" role="cell">
                {booking.hostelName}
              </div>
              <div className="hidden md:block md:w-1/6 text-sm font-medium text-gray-900" role="cell">
                ₦{booking.amount.toLocaleString()}
              </div>
              <div className="hidden md:block md:w-1/6" role="cell">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBookings;