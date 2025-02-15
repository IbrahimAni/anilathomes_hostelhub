'use client';

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedHostels from "./components/FeaturedHostels";
import WhyChooseUs from "./components/WhyChooseUs";
import Newsletter from "./components/Newsletter";
import DiscountModal from "./components/DiscountModal";

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setShowModal(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedHostels />
      <WhyChooseUs />
      <Newsletter />
      <DiscountModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

export default LandingPage;
