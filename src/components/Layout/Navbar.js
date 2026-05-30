import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getCategories } from '../../services/productService';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    loadCategories();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const closeCategories = () => {
    setIsCategoriesOpen(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categoryIcons = {
    'Men': 'fa-tshirt',
    'Women': 'fa-female',
    'Kids': 'fa-child',
    'Clothes': 'fa-shirt',
    'Accessories': 'fa-gem',
    'Shoes': 'fa-shoe-prints'
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-store text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Menghor Clothes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition font-medium">Home</Link>
            
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleCategories}
                className={`flex items-center gap-1 transition font-medium ${
                  isCategoriesOpen ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Shop
                <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-fadeIn">
                  <Link 
                    to="/products" 
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    onClick={closeCategories}
                  >
                    <i className="fas fa-border-all w-5 text-indigo-500"></i>
                    <span className="font-medium">All Products</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="max-h-80 overflow-y-auto">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        onClick={closeCategories}
                      >
                        <i className={`fas ${categoryIcons[category.name] || 'fa-tag'} w-5`}></i>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition font-medium">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition font-medium">Contact</Link>
            
            {user && <Link to="/orders" className="text-gray-600 hover:text-indigo-600 transition font-medium">My Orders</Link>}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative">
              <i className="fas fa-shopping-bag text-xl text-gray-600 hover:text-indigo-600 transition"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.full_name?.split(' ')[0]}</span>
                  <i className="fas fa-chevron-down text-xs text-gray-500"></i>
                </button>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 transition">
                    <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition font-medium">
                <i className="fas fa-user text-lg"></i>
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl text-gray-600`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <Link to="/" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
            
            {/* Mobile Categories Section */}
            <div className="py-2">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="w-full flex justify-between items-center py-2 text-gray-600"
              >
                <span>Shop</span>
                <i className={`fas fa-chevron-down transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {isCategoriesOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <Link to="/products" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      className="block py-2 text-gray-600 hover:text-indigo-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/about" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            
            {user && <Link to="/orders" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>My Orders</Link>}
            <Link to="/cart" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>Cart ({cartCount})</Link>
            
            <div className="pt-4 mt-2 border-t border-gray-100">
              {user ? (
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left py-2 text-gray-600">
                  <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                </button>
              ) : (
                <Link to="/login" className="block py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;