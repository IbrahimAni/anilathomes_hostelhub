import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Added Next.js Image import
import { auth } from "@/config/firebase";
import { UserService } from "@/services/user.service";
import { HostelService, HostelItem } from "@/services/hostel.service";

interface RecommendedHostelsProps {
  isNewUser?: boolean;
  limit?: number;
}

export const RecommendedHostels: React.FC<RecommendedHostelsProps> = ({ 
  isNewUser = false,
  limit = 3 
}) => {
  const [hostels, setHostels] = useState<HostelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          return;
        }
        
        let hostelData: HostelItem[] = [];
        
        if (isNewUser) {
          // For new users, fetch popular hostels
          hostelData = await HostelService.getPopularHostels(limit);
        } else {
          // For existing users, fetch personalized recommendations
          const userProfile = await UserService.getUserProfile(currentUser.uid);
          hostelData = await HostelService.getRecommendedHostels(
            currentUser.uid, 
            userProfile, 
            limit
          );
        }
        
        setHostels(hostelData);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHostels();
  }, [isNewUser, limit]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-60">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm" data-testid="recommended-hostels-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{isNewUser ? "Popular Hostels" : "Recommended Hostels"}</h2>
        <Link 
          href="/hostels"
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          data-testid="view-all-hostels"
        >
          View All
        </Link>
      </div>
      
      {hostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="hostels-grid">
          {hostels.map((hostel) => (
            <div 
              key={hostel.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all" 
              data-testid={`hostel-card-${hostel.id}`}
            >
              <div className="h-48 bg-gray-200 relative">
                {hostel.isFeatured && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
                {hostel.imageUrl ? (
                  <Image 
                    src={hostel.imageUrl} 
                    alt={hostel.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Hostel Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{hostel.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm font-medium mr-1">{hostel.rating.toFixed(1)}</span>
                    <span>★</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{hostel.location}</p>
                <div className="flex items-center mt-2">
                  <div className="flex-1">
                    <p className="font-bold">{hostel.price}</p>
                    <p className="text-xs text-gray-500">Available now</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/hostels/${hostel.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    data-testid={`view-hostel-${hostel.id}`}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No hostels available at this time</p>
        </div>
      )}
    </div>
  );
};