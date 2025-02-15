import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedHostels from "./components/FeaturedHostels";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedHostels />
    </div>
  );
};

export default LandingPage;
