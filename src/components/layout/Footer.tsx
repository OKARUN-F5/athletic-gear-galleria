
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sport-gray-800 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">SportyWear</h3>
            <p className="text-sport-gray-300 mb-4">
              The premier destination for high-quality sportswear and athletic apparel.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-sport-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-sport-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-sport-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-sport-blue transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/men" className="text-sport-gray-300 hover:text-white transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="text-sport-gray-300 hover:text-white transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="text-sport-gray-300 hover:text-white transition-colors">
                  Kids Collection
                </Link>
              </li>
              <li>
                <Link to="/category/accessories" className="text-sport-gray-300 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/category/sale" className="text-sport-gray-300 hover:text-white transition-colors">
                  Sale Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/customer-service" className="text-sport-gray-300 hover:text-white transition-colors">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sport-gray-300 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sport-gray-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sport-gray-300 hover:text-white transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sport-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2 text-sport-gray-300">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>123 Athleisure St, Sports City, SC 12345</span>
              </li>
              <li className="flex items-center space-x-2 text-sport-gray-300">
                <Phone size={18} className="flex-shrink-0" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-2 text-sport-gray-300">
                <Mail size={18} className="flex-shrink-0" />
                <span>contact@sportywear.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sport-gray-700 text-center text-sport-gray-400 text-sm">
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/accessibility" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
          <p>© {new Date().getFullYear()} SportyWear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
