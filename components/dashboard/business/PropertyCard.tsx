import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyData } from '@/types/business';

const PropertyCard: React.FC<PropertyData> = ({
  id,
  name,
  location,
  image,
  price,
  occupancyRate,
  bookings,
  testId
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg"
      data-testid={testId || `property-card-${id}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
          {occupancyRate}% Occupied
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 flex items-center mb-3">
          <i className="fas fa-map-marker-alt mr-1 text-indigo-500" aria-hidden="true"></i> {location}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-md font-bold text-gray-900">₦{price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bookings</p>
            <p className="text-md font-bold text-gray-900">{bookings}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link 
            href={`/dashboard/business/properties/${id}`}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded text-sm text-center hover:bg-indigo-700 transition-colors"
            aria-label={`View details for ${name}`}
            data-testid={`view-property-${id}`}
          >
            View Details
          </Link>
          <button 
            className="p-2 text-indigo-600 rounded border border-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label={`Edit ${name}`}
            data-testid={`edit-property-${id}`}
          >
            <i className="fas fa-edit" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;