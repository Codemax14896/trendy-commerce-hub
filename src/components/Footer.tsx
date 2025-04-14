
import { Link } from "react-router-dom";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tnTrendy-purple-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">TnTrendy</h3>
            <p className="text-tnTrendy-gray-soft">
              Your one-stop shop for trendy products with flexible subscription options.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-tnTrendy-gray-soft hover:text-white transition-colors">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-tnTrendy-gray-soft mb-4">
              Stay updated with our latest products and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none text-tnTrendy-purple-dark"
              />
              <button className="bg-tnTrendy-purple-vivid hover:bg-tnTrendy-purple-tertiary px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-tnTrendy-gray-soft">
            &copy; {currentYear} TnTrendy. All rights reserved.
          </p>
          <p className="text-tnTrendy-gray-soft mt-4 md:mt-0 flex items-center">
            Made with <Heart size={16} className="mx-1 text-red-500" /> by TnTrendy Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
