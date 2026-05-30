import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../services/paymentService';
import toast from 'react-hot-toast';

const QRPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('order_id');
    const amt = params.get('amount');
    const qr = params.get('qr');
    const url = params.get('qr_url');
    
    if (id && amt) {
      setOrderId(id);
      setAmount(amt);
      if (qr) setQrCode(decodeURIComponent(qr));
      if (url) setQrUrl(url);
      setLoading(false);
    } else {
      toast.error('Invalid payment request');
      navigate('/orders');
    }
  }, [location, navigate]);

  const handleVerify = async () => {
    if (!orderId) return;
    
    setVerifying(true);
    try {
      const result = await verifyPayment(orderId);
      if (result.verified) {
        toast.success('Payment successful!');
        navigate('/payment/success');
      } else {
        toast.error(result.message || 'Payment not found');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const qrImageUrl = qrUrl || (qrCode ? `https://quickchart.io/qr?text=${encodeURIComponent(qrCode)}&size=250&margin=2` : null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-500">Loading payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white p-6 text-center">
              <i className="fas fa-qrcode text-4xl mb-3"></i>
              <h1 className="text-2xl font-bold">KHQR Payment</h1>
              <p className="text-indigo-100 mt-1">Scan with your banking app</p>
            </div>
            
            <div className="p-6 text-center">
              <div className="mb-4">
                <p className="text-gray-500 text-sm">Order Number</p>
                <p className="text-xl font-mono font-bold">{orderId}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-500 text-sm">Amount to Pay</p>
                <p className="text-3xl font-bold text-indigo-600">${amount}</p>
              </div>
              
              {qrImageUrl && (
                <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-6">
                  <img 
                    src={qrImageUrl}
                    alt="KHQR Payment Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              )}
              
              <p className="text-gray-600 text-sm mb-4">Scan this QR code with your banking app</p>
              <div className="flex justify-center gap-2 mb-6">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">ABA</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">ACLEDA</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Wing</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">KHQR</span>
              </div>
              
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    Verifying Payment...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-check-circle"></i>
                    I have completed the payment
                  </span>
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                After scanning and paying, click verify to confirm your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;