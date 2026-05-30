import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SimpleSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Success page loaded with params:", location.search);
    
    // Redirect to orders after 2 seconds
    const timer = setTimeout(() => {
      navigate('/orders', { replace: true });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <i className="fas fa-check text-white text-5xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
        <p className="text-gray-500">Redirecting to your orders...</p>
      </div>
    </div>
  );
};

export default SimpleSuccess;