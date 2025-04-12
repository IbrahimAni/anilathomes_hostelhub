"use client";

import React from 'react';
import Image from 'next/image';

const featuredHostels = [
    {
        id: 1,
        name: "Scholar's Loft",
        location: "KWASU Malete",
        price: "150,000",
        image: "/assets/hostel1.svg",
    },
    {
        id: 2,
        name: "Campus Oasis",
        location: "Tanke Ilorin",
        price: "180,000",
        image: "/assets/hostel2.svg",
    },
    {
        id: 3,
        name: "Academic Retreat",
        location: "KWASU Malete",
        price: "200,000",
        image: "/assets/hostel3.svg",
    }
] as const;

const FeaturedHostels = () => {
    const handleViewDetails = React.useCallback((hostelId: number) => {
        console.log(`Viewing details for hostel ${hostelId}`);
    }, []);

    const onViewDetailsClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>, hostelId: number) => {
        e.preventDefault();
        handleViewDetails(hostelId);
    }, [handleViewDetails]);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Featured Hostels
                    </h2>
                    <p className="text-lg text-gray-600">
                        Discover our hand-picked selection of amazing hostels
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredHostels.map((hostel) => (
                        <div key={hostel.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                            <div className="relative h-64 w-full">
                                <Image 
                                    src={hostel.image} 
                                    data-testid={`hostel-image-${hostel.name}`}
                                    alt={hostel.name} 
                                    fill
                                    className="object-cover w-full h-full"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={hostel.name === "Scholar's Loft"}
                                />
                            </div>
                            <div className="p-4">
                                <h3 data-testid="hostel-name" className="text-xl font-semibold text-gray-900">{hostel.name}</h3>
                                <p data-testid="hostel-location" className="text-gray-600">{hostel.location}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span data-testid="hostel-price" className="text-primary font-bold">₦{hostel.price}/year</span>
                                    <button 
                                        data-testid={`view-details-button-${hostel.name}`}
                                        onClick={(e) => onViewDetailsClick(e, hostel.id)}
                                        className="px-4 py-2 text-sm bg-primary text-white hover:bg-primary/90 rounded transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedHostels;