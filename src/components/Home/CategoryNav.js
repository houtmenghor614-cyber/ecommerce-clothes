import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '../../services/productService';

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');
    if (categoryId) {
      setActiveCategory(parseInt(categoryId));
    } else {
      setActiveCategory(null);
    }
  }, [location]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const categoryIcons = {
    'Men': 'fa-tshirt',
    'Women': 'fa-female',
    'Kids': 'fa-child',
    'Clothes': 'fa-shirt',
    'Accessories': 'fa-gem',
    'Shoes': 'fa-shoe-prints'
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
          
          {/* Scrollable categories */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 py-3 min-w-max">
              {/* All Products Link */}
              <Link
                to="/products"
                onClick={() => setActiveCategory(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  !activeCategory
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-border-all text-xs"></i>
                <span>All</span>
              </Link>
              
              {/* Category Links */}
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`fas ${categoryIcons[category.name] || 'fa-tag'} text-xs`}></i>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryNav;