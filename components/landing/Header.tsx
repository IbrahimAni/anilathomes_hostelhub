"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed w-full top-0 z-50 flex justify-between items-center p-4 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="text-2xl font-bold text-primary">HostelHub</div>
      <nav className="hidden md:flex space-x-6">
        <Link href="/" className="text-gray-800 hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/hostels" className="text-gray-800 hover:text-primary transition-colors">
          Hostels
        </Link>
        <Link href="/about" className="text-gray-800 hover:text-primary transition-colors">
          About
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/login">
          <button type="button" className="hidden md:block px-4 py-2 text-primary hover:bg-primary hover:text-white border border-primary rounded transition-colors">
            Sign In
          </button>
        </Link>
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 flex flex-col space-y-4 z-50">
          <Link href="/" className="text-gray-800 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/hostels" className="text-gray-800 hover:text-primary transition-colors">
            Hostels
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/login">
            <button type="button" className="w-full px-4 py-2 text-primary hover:bg-primary hover:text-white border border-primary rounded transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;