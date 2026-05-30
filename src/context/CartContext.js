// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, color = null, size = null) => {
    setCart(prev => {
      const existing = prev.findIndex(
        item => item.id === product.id && item.selectedColor === color && item.selectedSize === size
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (item) => {
    setCart(prev => prev.filter(i => 
      !(i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize)
    ));
  };

  const updateQuantity = (item, quantity) => {
    if (quantity <= 0) {
      removeFromCart(item);
      return;
    }
    setCart(prev => prev.map(i =>
      i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
        ? { ...i, quantity }
        : i
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discount_price || item.original_price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};