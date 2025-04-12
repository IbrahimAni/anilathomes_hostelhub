import { useRouter } from "next/navigation";
import { FiBookmark } from "react-icons/fi";

const EmptyState = () => {
  const router = useRouter();
  
  return (
    <div 
      data-testid="empty-favorites-state"
      className="bg-white rounded-lg shadow-sm p-8 text-center"
    >
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <FiBookmark className="text-blue-500" size={24} />
      </div>
      <h2 className="text-xl font-semibold mt-4">No saved hostels yet</h2>
      <p className="text-gray-600 mt-2">
        Browse hostels and add them to your favorites to see them here.
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
};

export default EmptyState;
