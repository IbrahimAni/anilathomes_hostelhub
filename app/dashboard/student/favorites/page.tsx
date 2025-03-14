"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { FiBookmark, FiTrash2, FiExternalLink } from "react-icons/fi";

interface FavoriteHostel {
  id: string;
  name: string;
  location: string;
  price: string;
  imageUrl: string;
  addedAt: Date;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteHostel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        // In a real implementation, we would fetch favorites from Firebase
        // For now, using mock data
        const mockFavorites: FavoriteHostel[] = [
          {
            id: '1',
            name: 'Unilag Female Hostel',
            location: 'Akoka, Lagos',
            price: '₦180,000/year',
            imageUrl: '/assets/mock/hostel1.jpg',
            addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            id: '2',
            name: 'LASU Exclusive Male Hostel',
            location: 'Ojo, Lagos',
            price: '₦150,000/year',
            imageUrl: '/assets/mock/hostel2.jpg',
            addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          },
          {
            id: '3',
            name: 'UniAbuja Deluxe Hostel',
            location: 'Abuja, FCT',
            price: '₦200,000/year',
            imageUrl: '/assets/mock/hostel3.jpg',
            addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          },
          {
            id: '4',
            name: 'OAU Campus Lodge',
            location: 'Ile-Ife, Osun',
            price: '₦130,000/year',
            imageUrl: '/assets/mock/hostel4.jpg',
            addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
          },
          {
            id: '5',
            name: 'UI Standard Hostel',
            location: 'Ibadan, Oyo',
            price: '₦160,000/year',
            imageUrl: '/assets/mock/hostel5.jpg',
            addedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 21 days ago
          }
        ];

        setFavorites(mockFavorites);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  const removeFavorite = (id: string) => {
    // In a real implementation, we would update this in Firebase
    setFavorites(favorites.filter(favorite => favorite.id !== id));
    // Show success toast or notification
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
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
        <h1 className="text-3xl font-bold">Saved Hostels</h1>
        <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full flex items-center">
          <FiBookmark className="mr-1" />
          <span>{favorites.length} Saved</span>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {favorites.map((hostel) => (
            <div key={hostel.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-200">
                  {/* In a real implementation, we'd use proper image component */}
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
                        onClick={() => router.push(`/hostels/${hostel.id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors"
                      >
                        <FiExternalLink className="mr-2" />
                        View Details
                      </button>
                      
                      <button 
                        onClick={() => removeFavorite(hostel.id)}
                        className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-md flex items-center hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="mr-2" />
                        Remove
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/dashboard/student/bookings/new?hostelId=${hostel.id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <FiBookmark className="text-blue-500" size={24} />
          </div>
          <h2 className="text-xl font-semibold mt-4">No saved hostels yet</h2>
          <p className="text-gray-600 mt-2">
            Browse hostels and add them to your favorites to see them here.
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