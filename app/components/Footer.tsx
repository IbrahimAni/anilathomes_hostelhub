import Link from 'next/link';

const Footer = () => {
  return (
    <footer data-testid="footer" aria-label="Site footer" className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div data-testid="footer-brand">
            <h3 className="text-xl font-bold mb-4">HostelHub</h3>
            <p className="text-gray-400">Find your perfect student accommodation with ease.</p>
          </div>
          <nav data-testid="footer-links" aria-labelledby="nav-title">
            <h4 id="nav-title" className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" data-testid="footer-link-home" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" data-testid="footer-link-about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" data-testid="footer-link-contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </nav>
          <section data-testid="footer-contact" aria-labelledby="contact-title">
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <div className="text-gray-400">
              <p data-testid="footer-email">
                <span className='sr-only'>Email address</span>
                <Link href="mailto:info@anilathomes.com" className="hover:text-white transition-colors">Email: info@anilathomes.com</Link>
              </p>
              <p data-testid="footer-phone">
                <span className='sr-only'>Phone number</span>
                <Link href="tel:+2341234567890" className="hover:text-white transition-colors">Phone: +234 123 456 7890</Link>
              </p>
            </div>
          </section>
        </div>
        <div data-testid="footer-copyright" className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} HostelHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;