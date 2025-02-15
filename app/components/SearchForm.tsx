import React from 'react';

const locationOptions = ["KWASU Malete", "Tanke Ilorin"];

const SearchForm = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4 md:p-6">
      <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left">Location</label>
          <select className="h-[42px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-[#6c63ff] focus:border-[#6c63ff] text-gray-900">
            <option value="">Select Location</option>
            {locationOptions.map((location, key) => (
              <option key={key} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left">Move In Date</label>
          <input
            type="date"
            className="h-[42px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-[#6c63ff] focus:border-[#6c63ff]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left">Occupants</label>
          <select className="h-[42px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-[#6c63ff] focus:border-[#6c63ff] text-gray-900">
            <option value="1">1 Occupant</option>
            <option value="2">2 Occupants</option>
            <option value="3">3 Occupants</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left opacity-0">Search</label>
          <button
            type="submit"
            className="h-[42px] px-4 bg-[#6c63ff] hover:bg-[#5b54ff] text-white font-medium rounded-md transition-colors duration-200"
          >
            Search Hostels
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;