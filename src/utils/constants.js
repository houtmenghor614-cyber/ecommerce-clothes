export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://backend-ecommerce-6hef.onrender.com/api',
  TIMEOUT: 30000,
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  KHQR: 'khqr',
};