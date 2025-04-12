import { useRouter } from "next/navigation";
import { FiUser, FiSearch, FiHome } from "react-icons/fi";

export const GettingStartedSection: React.FC = () => {
  const router = useRouter();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm" data-testid="getting-started-section">
      <h2 className="text-xl font-semibold mb-6">Getting Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-5 flex flex-col items-center text-center" data-testid="getting-started-item-1">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <FiUser size={24} className="text-blue-600" />
          </div>
          <h3 className="font-medium mb-2">Complete Your Profile</h3>
          <p className="text-sm text-gray-600 mb-4">Add your university and preferences to get personalized recommendations</p>
          <button 
            onClick={() => router.push('/dashboard/student/profile')}
            className="mt-auto px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            Complete Profile
          </button>
        </div>
        
        <div className="border rounded-lg p-5 flex flex-col items-center text-center" data-testid="getting-started-item-2">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <FiSearch size={24} className="text-green-600" />
          </div>
          <h3 className="font-medium mb-2">Explore Hostels</h3>
          <p className="text-sm text-gray-600 mb-4">Browse hostels near your university and save your favorites</p>
          <button 
            onClick={() => router.push('/hostels')}
            className="mt-auto px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          >
            Find Hostels
          </button>
        </div>
        
        <div className="border rounded-lg p-5 flex flex-col items-center text-center" data-testid="getting-started-item-3">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <FiHome size={24} className="text-purple-600" />
          </div>
          <h3 className="font-medium mb-2">Book Your Stay</h3>
          <p className="text-sm text-gray-600 mb-4">Secure your accommodation with our easy booking process</p>
          <button 
            onClick={() => router.push('/hostels')}
            className="mt-auto px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};