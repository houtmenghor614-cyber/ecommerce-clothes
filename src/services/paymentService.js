import api from './api';

export const initiatePayment = async (orderId) => {
  const response = await api.post('/payment/initiate', { order_id: orderId });
  return response.data;
};

export const verifyPayment = async (transactionId) => {
  const response = await api.post('/payment/verify', { transaction_id: transactionId });
  return response.data;
};