import { useRouter } from "next/navigation";
import { FiExternalLink, FiTrash2 } from "react-icons/fi";

interface FavoriteHostel {
  id: string;
  name: string;
  location: string;
  price: string;
  imageUrl: string;
  addedAt: Date;
}

interface FavoriteCardProps {
  hostel: FavoriteHostel;
  onRemove: (id: string) => void;
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};

const FavoriteCard = ({ hostel, onRemove }: FavoriteCardProps) => {
  const router = useRouter();
  
  return (
    <div 
      data-testid={`favorite-card-${hostel.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-200">
          <div className="w-full h-full bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Hostel Image
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{hostel.name}</h2>
              <p className="text-gray-600">{hostel.location}</p>
            </div>
            <p className="font-bold text-lg">{hostel.price}</p>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Added on {formatDate(hostel.addedAt)}</p>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="space-x-2">
              <button 
                data-testid={`view-details-btn-${hostel.id}`}
                onClick={() => router.push(`/hostels/${hostel.id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors"
              >
                <FiExternalLink className="mr-2" />
                View Details
              </button>
              
              <button 
                data-testid={`remove-favorite-btn-${hostel.id}`}
                onClick={() => onRemove(hostel.id)}
                className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-md flex items-center hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="mr-2" />
                Remove
              </button>
            </div>
            
            <button 
              data-testid={`book-now-btn-${hostel.id}`}
              onClick={() => router.push(`/dashboard/student/bookings/new?hostelId=${hostel.id}`)}
              className="text-blue-500 hover:underline"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
