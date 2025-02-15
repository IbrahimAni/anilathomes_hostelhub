import React from 'react';

const Header = () => {
  return (
    <header className="fixed w-full top-0 z-50 flex justify-between items-center p-4 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="text-2xl font-bold text-[#6c63ff]">HostelHub</div>
      <nav className="hidden md:flex space-x-6">
        <a href="/" className="text-gray-800 hover:text-[#6c63ff] transition-colors">
          Home
        </a>
        <a href="/hostels" className="text-gray-800 hover:text-[#6c63ff] transition-colors">
          Hostels
        </a>
        <a href="/about" className="text-gray-800 hover:text-[#6c63ff] transition-colors">
          About
        </a>
      </nav>
      <div className="flex items-center gap-4">
        <button className="hidden md:block px-4 py-2 text-[#6c63ff] hover:bg-[#6c63ff] hover:text-white border border-[#6c63ff] rounded transition-colors">
          Sign In
        </button>
        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600 hover:text-[#6c63ff]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;