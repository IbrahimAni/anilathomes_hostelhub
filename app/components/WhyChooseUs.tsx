import React from "react";
import {
  FaRegMoneyBillAlt,
  FaCalendarTimes,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRegMoneyBillAlt className="w-12 h-12 text-primary" />,
    title: "No Booking Fee",
    description: "Book your perfect hostel stay without any additional charges",
  },
  {
    icon: <FaCalendarTimes className="w-12 h-12 text-primary" />,
    title: "Free Cancellation",
    description:
      "Plans change? No problem. Cancel your booking without any penalties",
  },
  {
    icon: <FaHeadset className="w-12 h-12 text-primary" />,
    title: "24/7 Support",
    description: "Our dedicated team is here to help you anytime, day or night",
  },
  {
    icon: <FaShieldAlt className="w-12 h-12 text-primary" />,
    title: "Best Price Guarantee",
    description:
      "Find a lower price? We'll match it and give you an extra discount",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      className="pb-16 pt-4 bg-gray-50"
      data-testid="why-choose-us-section"
      aria-label="Why Choose HostelHub Section"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            data-testid="why-choose-us-heading"
          >
            Why Choose HostelHub?
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            data-testid="why-choose-us-subheading"
          >
            We make finding and booking your perfect hostel simple and
            worry-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
              data-testid={`feature-card-${index}`}
              aria-label={feature.title}
            >
              <div
                className="flex justify-center mb-6"
                aria-label={`${feature.title} icon`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
