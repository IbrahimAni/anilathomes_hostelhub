import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedHostels from "./components/FeaturedHostels";
import WhyChooseUs from "./components/WhyChooseUs";
import Newsletter from "./components/Newsletter";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedHostels />
      <WhyChooseUs />
      <Newsletter />
    </div>
  );
};

export default LandingPage;
