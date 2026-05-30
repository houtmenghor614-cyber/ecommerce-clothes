import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const discountPercent = product.discount_price 
    ? Math.round(((product.original_price - product.discount_price) / product.original_price) * 100)
    : 0;
  
  const BASE_URL = 'http://127.0.0.1:8000';
  const imageUrl = product.main_image ? `${BASE_URL}${product.main_image}` : null;
  
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 product-card">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden h-72">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <i className="fas fa-image text-5xl text-gray-300"></i>
            </div>
          )}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
              -{discountPercent}%
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Quick View
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition">
            {product.title}
          </h3>
          
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