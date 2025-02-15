import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer data-testid="footer" className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div data-testid="footer-brand">
            <h3 className="text-xl font-bold mb-4">HostelHub</h3>
            <p className="text-gray-400">Find your perfect student accommodation with ease.</p>
          </div>
          <div data-testid="footer-links">
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" data-testid="footer-link-home" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" data-testid="footer-link-about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" data-testid="footer-link-contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div data-testid="footer-contact">
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <div className="text-gray-400">
              <p data-testid="footer-email">Email: info@hostelhub.com</p>
              <p data-testid="footer-phone">Phone: +234 123 456 7890</p>
            </div>
          </div>
        </div>
        <div data-testid="footer-copyright" className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} HostelHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;