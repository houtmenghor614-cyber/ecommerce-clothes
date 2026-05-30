import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadOrders = useCallback(async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadOrders]);

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

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Payment',
      paid: 'Paid ✓',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return texts[status] || status;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-box-open text-6xl text-gray-400 mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
        <Link to="/products" className="btn-primary inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order.order_number}</p>
                  {/* User Name added here */}
                  <p className="text-sm text-indigo-600 font-medium mt-1 flex items-center gap-1">
                    <i className="fas fa-user text-xs"></i>
                    {user?.full_name || 'Customer'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1`}>
                    <i className={`fas ${order.status === 'paid' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-indigo-600">${order.total_amount}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.items?.length || 0} item(s)
                    </p>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="mt-3 md:mt-0 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    View Details
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;