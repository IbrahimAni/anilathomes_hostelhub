"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { FiBookmark } from "react-icons/fi";
import FavoritesList, { FavoriteHostel } from "@/components/dashboard/student/favorites/FavoritesList";

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
        // For now, either an empty array or mock data based on implementation needs
        setFavorites([]);
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

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div data-testid="favorites-page" className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Saved Hostels</h1>
        <div data-testid="favorites-count" className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full flex items-center">
          <FiBookmark className="mr-1" />
          <span>{favorites.length} Saved</span>
        </div>
      </div>

      <FavoritesList 
        favorites={favorites} 
        onRemove={removeFavorite} 
      />
    </div>
  );
}