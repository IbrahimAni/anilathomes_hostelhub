import { useRouter } from "next/navigation";
import { FiClock } from "react-icons/fi";

interface EmptyBookingsProps {
  activeFilter: string;
}

export default function EmptyBookings({ activeFilter }: EmptyBookingsProps) {
  const router = useRouter();
  
  return (
    <div data-testid="empty-bookings" className="bg-white rounded-lg shadow-sm p-8 text-center">
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
        data-testid="browse-hostels-btn"
        onClick={() => router.push('/hostels')}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Browse Hostels
      </button>
    </div>
  );
}
