"use client";

import React from 'react';
import { useForm } from 'react-hook-form';

const locationOptions = ["KWASU Malete", "Tanke Ilorin"];

type SearchFormData = {
  location: string;
  moveInDate: string;
  occupants: string;
};

const SearchForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>();

  const onSubmit = (data: SearchFormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div data-testid="search-form-container" className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4 md:p-6">
      <form onSubmit={handleSubmit(onSubmit)} data-testid="search-form" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left">Location</label>
          <select
            data-testid="location-select"
            {...register('location', { required: 'Location is required' })}
            className="h-[42px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-[#6c63ff] focus:border-[#6c63ff] text-gray-900"
          >
            <option value="">Select Location</option>
            {locationOptions.map((location, key) => (
              <option key={key} value={location}>{location}</option>
            ))}
          </select>
          {errors.location && <p data-testid="location-error" className="mt-1 text-sm text-red-600 text-left">{errors.location.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left">Move In Date</label>
          <input
            data-testid="move-in-date"
            type="date"
            {...register('moveInDate', { required: 'Move in date is required' })}
            className="h-[42px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-[#6c63ff] focus:border-[#6c63ff]"
          />
          {errors.moveInDate && <p data-testid="move-in-date-error" className="mt-1 text-sm text-red-600 text-left">{errors.moveInDate.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left">Occupants</label>
          <select
            data-testid="occupants-select"
            {...register('occupants', { required: 'Number of occupants is required' })}
            className="h-[42px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-[#6c63ff] focus:border-[#6c63ff] text-gray-900"
          >
            <option value="1">1 Occupant</option>
            <option value="2">2 Occupants</option>
            <option value="3">3 Occupants</option>
          </select>
          {errors.occupants && <p data-testid="occupants-error" className="mt-1 text-sm text-red-600 text-left">{errors.occupants.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 text-left opacity-0">Search</label>
          <button
            data-testid="search-button"
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