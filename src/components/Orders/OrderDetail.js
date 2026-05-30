import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderDetail } from '../../services/orderService';
import { initiatePayment, verifyPayment } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentDetected, setPaymentDetected] = useState(false);

  const BASE_URL = 'http://127.0.0.1:8000';

  const loadOrder = useCallback(async () => {
    try {
      const data = await getOrderDetail(id);
      setOrder(data);
      if (data.status === 'paid') {
        setPaymentDetected(true);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Auto-check payment status every 3 seconds
  useEffect(() => {
    if (!order || order.status !== 'pending') return;
    
    let isMounted = true;
    let checkCount = 0;
    const maxChecks = 20;
    
    const checkPayment = async () => {
      if (!isMounted) return;
      if (order.status !== 'pending') return;
      if (checkCount >= maxChecks) return;
      
      checkCount++;
      try {
        const result = await verifyPayment(order.order_number);
        if (result.verified && isMounted) {
          setPaymentDetected(true);
          toast.success('🎉 Payment detected! Your order is now confirmed!', {
            duration: 5000,
            icon: '✅'
          });
          await loadOrder();
        }
      } catch (error) {
        // Silent fail
      }
    };
    
    checkPayment();
    const interval = setInterval(checkPayment, 3000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [order, loadOrder]);

  const handlePayNow = async () => {
    try {
      const response = await initiatePayment(order.id);
      if (response.payment_url) {
        const paymentWindow = window.open(response.payment_url, '_blank');
        toast.success('Payment page opened! Complete payment - it will be detected automatically.', {
          duration: 5000
        });
        if (paymentWindow) paymentWindow.focus();
      } else {
        toast.error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to initiate payment');
    }
  };

  const handleManualCheck = async () => {
    setCheckingPayment(true);
    try {
      const result = await verifyPayment(order.order_number);
      if (result.verified) {
        toast.success('✅ Payment confirmed! Your order is now paid.');
        await loadOrder();
      } else {
        toast.error('Payment not found. If you just paid, please wait a moment.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Failed to check payment status');
    } finally {
      setCheckingPayment(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      paid: 'bg-green-500',
      shipped: 'bg-blue-500',
      delivered: 'bg-purple-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusBadge = (status) => {
    const labels = {
      pending: 'Pending Payment',
      paid: 'Paid ✓',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-500">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/orders" className="text-indigo-600 hover:text-indigo-700">
          ← Back to Orders
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
              </p>
              {/* Show User Name */}
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <i className="fas fa-user text-indigo-500"></i>
                <span>Customer: <strong className="text-gray-800">{user?.full_name || 'Guest User'}</strong></span>
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1`}>
                <i className={`fas ${order.status === 'paid' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                {getStatusBadge(order.status)}
              </span>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const imageUrl = item.product_main_image ? `${BASE_URL}${item.product_main_image}` : null;
                
                return (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.product_title} className="w-full h-full object-cover rounded" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <i className="fas fa-image text-gray-400"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.product_title}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ${item.price_at_time}
                        {item.selected_color && ` | Color: ${item.selected_color}`}
                        {item.selected_size && ` | Size: ${item.selected_size}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.quantity * item.price_at_time).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Shipping Address:</p>
                <p className="font-semibold">{order.shipping_address}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total Amount:</p>
                <p className="text-2xl font-bold text-indigo-600">${order.total_amount}</p>
              </div>
            </div>
          </div>
          
          {order.payment_transaction_id && (
            <div className="border-t mt-6 pt-6">
              <p className="text-gray-600 mb-1">Transaction ID:</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">{order.payment_transaction_id}</p>
            </div>
          )}
          
          {order.status === 'pending' && (
            <div className="border-t mt-6 pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <i className="fas fa-info-circle text-blue-500 text-lg"></i>
                  <div>
                    <p className="font-semibold text-blue-800">Auto Payment Detection Active</p>
                    <p className="text-sm text-blue-600">
                      Payment will be detected automatically within 3-5 seconds after completion!
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePayNow}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-credit-card"></i>
                  Pay Now
                </button>
                <button
                  onClick={handleManualCheck}
                  disabled={checkingPayment}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkingPayment ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Checking...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt"></i>
                      Check Status
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Auto-check runs every 3 seconds. Your order will update automatically when payment is complete.
              </p>
            </div>
          )}
          
          {order.status === 'paid' && (
            <div className="border-t mt-6 pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Payment Confirmed!</p>
                    <p className="text-sm text-green-600">Your order is being processed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {order.status === 'shipped' && (
            <div className="border-t mt-6 pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-truck text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Order Shipped!</p>
                    <p className="text-sm text-blue-600">Your order is on the way!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {order.status === 'delivered' && (
            <div className="border-t mt-6 pt-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-gift text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800">Order Delivered!</p>
                    <p className="text-sm text-purple-600">Thank you for shopping with us!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;