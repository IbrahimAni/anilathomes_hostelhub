'use client';

import React, { useEffect, useState } from "react";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import FeaturedHostels from "../components/landing/FeaturedHostels";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import Newsletter from "../components/landing/Newsletter";
import DiscountModal from "../components/landing/DiscountModal";
import Footer from "@/components/landing/Footer";

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
    <>
      <Header />
      <div className="min-h-screen">
        <Hero />
        <FeaturedHostels />
        <WhyChooseUs />
        <Newsletter />
        <DiscountModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
