// src/components/Products/ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const discountPercent = product.discount_price 
    ? Math.round(((product.original_price - product.discount_price) / product.original_price) * 100)
    : 0;
  
  const BASE_URL = 'https://menghor-store-backend.onrender.com';
  const imageUrl = product.main_image ? `${BASE_URL}${product.main_image}` : null;
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <i className="fas fa-image text-5xl text-gray-300"></i>
            </div>
          )}
          
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
              -{discountPercent}%
            </div>
          )}
          
          {/* Quick add button on hover */}
          <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-gray-900 py-2 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Quick Add
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              <i className="fas fa-star text-yellow-400 text-xs"></i>
              <i className="fas fa-star text-yellow-400 text-xs"></i>
              <i className="fas fa-star text-yellow-400 text-xs"></i>
              <i className="fas fa-star text-yellow-400 text-xs"></i>
              <i className="fas fa-star-half-alt text-yellow-400 text-xs"></i>
            </div>
            <span className="text-xs text-gray-400">(128)</span>
          </div>
          
          <div className="flex items-center gap-2">
            {product.discount_price ? (
              <>
                <span className="text-xl font-bold text-indigo-600">
                  ${product.discount_price}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ${product.original_price}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-indigo-600">
                ${product.original_price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;