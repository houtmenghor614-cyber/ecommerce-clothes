import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '../../services/productService';

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollContainerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    loadCategories();
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');
    if (categoryId) {
      setActiveCategory(parseInt(categoryId));
      // Scroll to active category
      setTimeout(() => {
        const activeElement = document.querySelector(`.category-item-${categoryId}`);
        if (activeElement && scrollContainerRef.current) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 100);
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

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
          {/* Scroll Left Button */}
          {showScrollButtons && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-20 hover:bg-gray-100 transition md:hidden"
              style={{ marginLeft: '-8px' }}
            >
              <i className="fas fa-chevron-left text-gray-600 text-sm"></i>
            </button>
          )}

          {/* Scrollable categories */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide py-3"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex items-center gap-2 min-w-max px-1">
              {/* All Products Link */}
              <Link
                to="/products"
                onClick={() => setActiveCategory(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation ${
                  !activeCategory
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
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
                  className={`category-item-${category.id} flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap touch-manipulation ${
                    activeCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <i className={`fas ${categoryIcons[category.name] || 'fa-tag'} text-xs`}></i>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Scroll Right Button */}
          {showScrollButtons && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-20 hover:bg-gray-100 transition md:hidden"
              style={{ marginRight: '-8px' }}
            >
              <i className="fas fa-chevron-right text-gray-600 text-sm"></i>
            </button>
          )}
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
        .touch-manipulation {
          touch-action: manipulation;
        }
        @media (max-width: 768px) {
          .category-item {
            padding: 8px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryNav;