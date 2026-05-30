import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-store text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold">MENGHOR STORE</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier destination for premium fashion and accessories.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition text-sm">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition text-sm">Shop</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-white transition text-sm">My Orders</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <i className="fas fa-phone w-4"></i>
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <i className="fas fa-envelope w-4"></i>
                <span>support@menghorstore.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <i className="fas fa-map-marker-alt w-4"></i>
                <span>Phnom Penh, Cambodia</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1DG2bc3fDr/?mibextid=wwXIfr" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/horzer5?igsh=MTR5N3A5bWU4ZTdhZQ%3D%3D&utm_source=qr" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://t.me/hortmenghor" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Menghor Clothes All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;