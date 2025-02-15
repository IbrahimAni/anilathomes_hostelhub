import React from "react";
import SearchForm from "./SearchForm";
import HeroBackground from "./HeroBackground";

const header: string = "Find Your Perfect Hostel";
const subheader: string = "Discover unique stays at the best prices worldwide";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-16">
      <HeroBackground 
        src="/assets/heroImage.svg"
        alt="Hero background illustration"
      />

      <div className="container mx-auto px-4 py-32 md:py-48 text-center">
        <h1 className="text-4xl md:text-6xl text-white font-bold mb-8" data-testid="hero-header">
          {header}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-16" data-testid="hero-subheader">
          {subheader}
        </p>

        <div className="bg-black/10 rounded-lg p-4">
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
