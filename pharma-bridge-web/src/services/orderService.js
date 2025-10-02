import api from '../api/api';

const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/order/create', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  getOrdersByPharmacy: async () => {
    try {
      const response = await api.get('/order/pharmacy');
      return response.data;
    } catch (error) {
      console.error('Error fetching pharmacy orders:', error);
      throw error;
    }
  }
};

export default orderService;