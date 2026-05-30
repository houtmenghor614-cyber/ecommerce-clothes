import React from 'react';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const price = item.discount_price || item.original_price;
  const itemTotal = price * item.quantity;
  
  const BASE_URL = 'http://127.0.0.1:8000';
  const imageUrl = item.main_image ? `${BASE_URL}${item.main_image}` : null;

  return (
    <div className="flex flex-col md:flex-row items-center p-4 border-b hover:bg-gray-50">
      <div className="w-24 h-24 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
            <i className="fas fa-image text-gray-400 text-2xl"></i>
          </div>
        )}
      </div>
      
      <div className="flex-1 md:ml-4 mt-2 md:mt-0">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        {(item.selectedColor || item.selectedSize) && (
          <p className="text-sm text-gray-600">
            {item.selectedColor && `Color: ${item.selectedColor}`}
            {item.selectedColor && item.selectedSize && ' | '}
            {item.selectedSize && `Size: ${item.selectedSize}`}
          </p>
        )}
        <p className="text-indigo-600 font-semibold">${price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item, item.quantity - 1)}
            className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            -
          </button>
          <span className="w-12 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item, item.quantity + 1)}
            className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            +
          </button>
        </div>
        
        <p className="font-semibold w-20 text-right">${itemTotal.toFixed(2)}</p>
        
        <button
          onClick={() => onRemove(item)}
          className="text-red-500 hover:text-red-700"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;