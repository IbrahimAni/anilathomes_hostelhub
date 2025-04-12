import Link from "next/link";
import { FiBookmark, FiClock, FiCreditCard, FiArrowRight } from "react-icons/fi";

interface StatsCardsProps {
  stats: {
    favorites: number;
    bookings: number;
    payments: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4" data-testid="stats-section">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow" data-testid="favorites-card">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <FiBookmark className="text-blue-500" size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Saved Hostels</p>
            <h3 className="text-2xl font-bold" data-testid="favorites-count">{stats.favorites}</h3>
          </div>
        </div>
        <Link 
          href="/dashboard/student/favorites"
          className="mt-4 flex items-center text-blue-500 text-sm font-medium hover:underline"
          data-testid="favorites-link"
        >
          {stats.favorites > 0 ? "View all saved hostels" : "Start saving hostels"}
          <FiArrowRight className="ml-1" size={14} />
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow" data-testid="bookings-card">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-full">
            <FiClock className="text-green-500" size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Active Bookings</p>
            <h3 className="text-2xl font-bold" data-testid="bookings-count">{stats.bookings}</h3>
          </div>
        </div>
        <Link 
          href={stats.bookings > 0 ? "/dashboard/student/bookings" : "/hostels"}
          className="mt-4 flex items-center text-green-500 text-sm font-medium hover:underline"
          data-testid="bookings-link"
        >
          {stats.bookings > 0 ? "Manage your bookings" : "Browse hostels to book"}
          <FiArrowRight className="ml-1" size={14} />
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow" data-testid="payments-card">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-full">
            <FiCreditCard className="text-purple-500" size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Payment History</p>
            <h3 className="text-2xl font-bold" data-testid="payments-count">{stats.payments}</h3>
          </div>
        </div>
        <Link 
          href="/dashboard/student/payments"
          className="mt-4 flex items-center text-purple-500 text-sm font-medium hover:underline"
          data-testid="payments-link"
        >
          {stats.payments > 0 ? "View payment history" : "Payment methods"}
          <FiArrowRight className="ml-1" size={14} />
        </Link>
      </div>
    </div>
  );
};