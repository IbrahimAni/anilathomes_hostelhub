import React from 'react';
import Image from 'next/image';

const FeaturedHostels = () => {
    const featuredHostels = [
        {
            id: 1,
            name: "Student Haven",
            location: "KWASU Malete",
            price: "150,000",
            image: "/assets/hostel1.svg",
        },
        {
            id: 2,
            name: "Campus Lodge",
            location: "Tanke Ilorin",
            price: "180,000",
            image: "/assets/hostel1.svg",
        },
        {
            id: 3,
            name: "Unity Hall",
            location: "KWASU Malete",
            price: "200,000",
            image: "/assets/hostel1.svg",
        }
    ];

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
                            <div className="relative h-48 bg-gray-200">
                                <Image 
                                    src={hostel.image} 
                                    alt={hostel.name} 
                                    layout="fill" 
                                    objectFit="cover" 
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900">{hostel.name}</h3>
                                <p className="text-gray-600">{hostel.location}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-[#6c63ff] font-bold">₦{hostel.price}/year</span>
                                    <button className="px-4 py-2 text-sm text-[#6c63ff] hover:bg-[#6c63ff] hover:text-white border border-[#6c63ff] rounded transition-colors">
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