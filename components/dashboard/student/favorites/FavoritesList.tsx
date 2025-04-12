import { useState } from "react";
import FavoriteCard from "./FavoriteCard";
import EmptyState from "./EmptyState";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface FavoriteHostel {
  id: string;
  name: string;
  location: string;
  price: string;
  imageUrl: string;
  addedAt: Date;
}

interface FavoritesListProps {
  favorites: FavoriteHostel[];
  onRemove: (id: string) => void;
}

const ITEMS_PER_PAGE = 5;

const FavoritesList = ({ favorites, onRemove }: FavoritesListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!favorites.length) {
    return <EmptyState />;
  }
  
  // Pagination logic
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFavorites = favorites.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div data-testid="favorites-list">
      <div className="grid grid-cols-1 gap-6">
        {paginatedFavorites.map((hostel) => (
          <FavoriteCard 
            key={hostel.id} 
            hostel={hostel} 
            onRemove={onRemove} 
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, favorites.length)} of {favorites.length} hostels
          </div>
          <div className="flex space-x-2">
            <button 
              data-testid="pagination-prev"
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
              className={`p-2 rounded-md flex items-center ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <FiChevronLeft className="mr-1" />
              Previous
            </button>
            <button 
              data-testid="pagination-next"
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md flex items-center ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              Next
              <FiChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
