/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentQR = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('order_id');
    const amt = params.get('amount');
    const url = params.get('payment_url');
    
    if (id && amt) {
      setOrderId(id);
      setAmount(amt);
      if (url) setPaymentUrl(decodeURIComponent(url));
    } else {
      toast.error('Invalid payment request');
      navigate('/orders');
    }
  }, [location, navigate]);

  const autoCheckPayment = useCallback(async () => {
    if (!orderId) return;
    
    try {
      const result = await verifyPayment(orderId);
      if (result.verified) {
        toast.success('Payment confirmed! Redirecting...');
        navigate('/payment/success');
      }
    } catch (error) {
      // Silent fail
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (!orderId) return;
    
    const interval = setInterval(() => {
      if (checkCount < 20) {
        autoCheckPayment();
        setCheckCount(prev => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [orderId, checkCount, autoCheckPayment]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await verifyPayment(orderId);
      if (result.verified) {
        toast.success('Payment verified successfully!');
        navigate('/payment/success');
      } else {
        toast.error('Payment not found. Please complete the payment.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const openPaymentPage = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
      setCheckCount(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-qrcode text-4xl text-indigo-600"></i>
          </div>
          <h1 className="text-2xl font-bold mb-2">KHQR Payment</h1>
          <p className="text-gray-600 mb-2">Order #{orderId}</p>
          <p className="text-2xl font-bold text-indigo-600 mb-6">${amount}</p>
          
          <div className="bg-gray-100 p-8 rounded-lg mb-6">
            <div className="text-center">
              <i className="fas fa-qrcode text-8xl text-gray-600 mb-4"></i>
              <p className="text-gray-600">Scan QR code with your banking app</p>
              <p className="text-sm text-gray-500 mt-2">ABA • ACLEDA • Wing • KHQR</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={openPaymentPage}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-external-link-alt"></i>
              Open Payment Page
            </button>
            
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>
                  Verify Payment
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              After payment, the page will automatically detect your payment!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQR;