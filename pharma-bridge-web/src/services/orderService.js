import api from '../api/api';

/**
 * @typedef {Object} OrderAdditionalComponent
 * @property {number} id - ID do componente adicional
 * @property {string} activeIngredientName - Nome do ingrediente ativo
 * @property {number} concentrationValue - Valor da concentração
 * @property {string} concentrationUnit - Unidade de concentração (mg, %, UI, etc.)
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} id - ID do item
 * @property {number} quoteItemId - ID do item da cotação
 * @property {string} mainCompoundName - Nome principal do composto
 * @property {string} pharmaceuticalForm - Forma farmacêutica
 * @property {number} concentrationValue - Valor da concentração
 * @property {string} concentrationUnit - Unidade de concentração
 * @property {number} totalQuantity - Quantidade total
 * @property {string} quantityUnit - Unidade de quantidade
 * @property {string} observation - Observação
 * @property {number} price - Preço
 * @property {boolean} ignore - Flag para ignorar
 * @property {OrderAdditionalComponent[]} additionalComponents - Lista de componentes adicionais
 */

/**
 * @typedef {Object} Order
 * @property {number} id - ID da ordem
 * @property {number} quoteId - ID da cotação
 * @property {number} pharmacyId - ID da farmácia
 * @property {number} pharmacyUserId - ID do usuário da farmácia
 * @property {string} createDate - Data de criação
 * @property {string} updateDate - Data de atualização
 * @property {number} status - Status da ordem
 * @property {number} shippingCost - Custo de envio
 * @property {number} discountValue - Valor de desconto
 * @property {OrderItem[]} items - Itens da ordem
 */

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
  
  getOrdersByUser: async () => {
    try {
      const response = await api.get('/order/get-orders-by-user');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders by user:', error);
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
  },

  /**
   * Lista as ordens com filtro opcional de status
   * @param {string|null} status - Status para filtrar as ordens (opcional)
   * @returns {Promise<Order[]>} - Array de ordens
   */
  listOrders: async (status = null) => {
    try {
      let url = "/order/get-orders-by-pharmacy";
      if (status !== null && status !== '') {
        url += `?status=${status}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error listing orders:', error);
      throw error;
    }
  }
};

export default orderService;