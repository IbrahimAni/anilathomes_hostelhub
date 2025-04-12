"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";

// Types
import { Booking } from "@/types/booking";

// Components
import BookingCard from "@/components/dashboard/student/bookings/BookingCard";
import BookingFilters from "@/components/dashboard/student/bookings/BookingFilters";
import EmptyBookings from "@/components/dashboard/student/bookings/EmptyBookings";
import LoadingSpinner from "@/components/dashboard/student/bookings/LoadingSpinner";

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

        // In the future, we will fetch bookings from Firestore here
        // Example: const bookingsData = await fetchBookingsFromFirestore(currentUser.uid);
        
        // For now, we're starting with an empty array as we're preparing for production
        setBookings([]);
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
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <button
          data-testid="book-new-hostel-btn"
          onClick={() => router.push('/hostels')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Book New Hostel
        </button>
      </div>

      <BookingFilters 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyBookings activeFilter={activeFilter} />
      )}
    </div>
  );
}