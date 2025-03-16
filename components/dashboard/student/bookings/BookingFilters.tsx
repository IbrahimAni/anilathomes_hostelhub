interface BookingFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function BookingFilters({ 
  activeFilter, 
  onFilterChange 
}: BookingFiltersProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-8">
        <button
          data-testid="filter-all"
          onClick={() => onFilterChange('all')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          All Bookings
        </button>
        <button
          data-testid="filter-active"
          onClick={() => onFilterChange('active')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'active'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Active
        </button>
        <button
          data-testid="filter-upcoming"
          onClick={() => onFilterChange('upcoming')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'upcoming'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Upcoming
        </button>
        <button
          data-testid="filter-completed"
          onClick={() => onFilterChange('completed')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'completed'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
