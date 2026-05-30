import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkPaymentStatus } from '../../services/paymentService';  // Changed from '../services' to '../../services'
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [orderId, setOrderId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('order_id');
    const amt = params.get('amount');
    const url = params.get('payment_url');
    
    if (id && amt) {
      setOrderId(id);
      setAmount(amt);
      if (url) {
        setPaymentUrl(decodeURIComponent(url));
      }
    } else {
      toast.error('Invalid payment request');
      navigate('/orders');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePayNow = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      toast.error('Payment URL not available');
    }
  };

  const handleVerify = async () => {
    if (!orderId) return;
    
    setVerifying(true);
    try {
      const result = await checkPaymentStatus(orderId);
      if (result.verified) {
        toast.success('Payment successful!');
        navigate('/payment/success');
      } else {
        toast.error('Payment not completed yet. Please complete payment first.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-center">
              <h1 className="text-2xl font-bold text-white">KHQR Payment</h1>
              <p className="text-indigo-100 text-sm mt-1">Pay with any Cambodian banking app</p>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-b text-center">
              <p className="text-gray-500 text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-indigo-600">${amount}</p>
            </div>
            
            <div className="px-6 py-8 text-center">
              <button
                onClick={handlePayNow}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-lg"
              >
                Pay ${amount} with KHQR
              </button>
              <p className="text-xs text-gray-500 mt-3">
                You will be redirected to KHQR payment gateway
              </p>
            </div>
            
            <div className="px-6 py-4 bg-blue-50 border-t border-b">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Supported Banks:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white px-2 py-1 rounded text-xs">🏦 ABA Bank</span>
                    <span className="bg-white px-2 py-1 rounded text-xs">🏦 ACLEDA</span>
                    <span className="bg-white px-2 py-1 rounded text-xs">🏦 Wing</span>
                    <span className="bg-white px-2 py-1 rounded text-xs">🏦 Pi Pay</span>
                    <span className="bg-white px-2 py-1 rounded text-xs">🏦 TrueMoney</span>
                    <span className="bg-white px-2 py-1 rounded text-xs">🏦 AMK</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-6 bg-gray-50">
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 font-semibold"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    I've Completed Payment ({countdown}s)
                  </span>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                After completing payment in your banking app, click the button above to verify
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;