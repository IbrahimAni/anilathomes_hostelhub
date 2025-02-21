'use client';

import React, { useEffect, useState } from "react";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import FeaturedHostels from "../components/landing/FeaturedHostels";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import Newsletter from "../components/landing/Newsletter";
import DiscountModal from "../components/landing/DiscountModal";

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
