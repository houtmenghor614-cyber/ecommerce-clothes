import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-white text-4xl"></i>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          <div className="space-y-3">
            <Link to="/orders" className="block w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition text-center">
              <i className="fas fa-box mr-2"></i>
              View My Orders
            </Link>
            <Link to="/" className="block w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-600 hover:text-white transition text-center">
              <i className="fas fa-home mr-2"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;