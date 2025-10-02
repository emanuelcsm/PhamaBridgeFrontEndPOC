import api from '../api/api';

/**
 * Serviço para gerenciar operações relacionadas a cotações
 */
// Cache simples para armazenar resultados de requisições
const cache = {};

const quoteService = {
  /**
   * Busca a lista de cotações do usuário atual
   * @param {string} status - Filtro de status opcional
   * @returns {Promise<Array>} - Lista de cotações
   */
  getQuotes: async (status = "") => {
    let url = '/quote/list';
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  /**
   * Busca a lista de cotações para a farmácia
   * @param {string} status - Filtro de status opcional
   * @returns {Promise<Array>} - Lista de cotações para a farmácia
   */
  getPharmacyQuotes: async () => {
    let url = '/quote/listpending';
    
    const response = await api.get(url);
    return response.data;
  },
  
  /**
   * Busca os detalhes de uma cotação específica, incluindo a imagem da prescrição
   * @param {number} quoteId - ID da cotação
   * @returns {Promise<Object>} - Detalhes da cotação com URL da imagem
   */
  getQuoteDetails: async (quoteId) => {
    // Chave de cache única para esta cotação
    const cacheKey = `quote_${quoteId}`;
    
    // Verifica se já temos os detalhes em cache
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    
    try {
      const quoteResponse = await api.get(`/quote/${quoteId}`);
      const quoteData = quoteResponse.data;
      
      // Se há um ID de imagem de prescrição, busca a imagem
      if (quoteData.prescriptionImageId) {
        try {
          // Busca o blob da imagem da prescrição
          const imageBlob = await api.getBlob(`/prescription/${quoteData.prescriptionImageId}/image`);
          
          // Cria uma URL para o blob
          const imageUrl = URL.createObjectURL(imageBlob);
          
          const result = {
            ...quoteData,
            image: imageUrl
          };
          
          // Guarda no cache
          cache[cacheKey] = result;
          return result;
        } catch (imageError) {
          console.error('Erro ao buscar imagem da prescrição:', imageError);
          // Guarda no cache
          cache[cacheKey] = quoteData;
          return quoteData;
        }
      }
      
      // Guarda no cache
      cache[cacheKey] = quoteData;
      return quoteData;
    } catch (error) {
      console.error('Erro ao buscar detalhes da cotação:', error);
      throw error;
    }
},
  
  /**
   * Cancela uma cotação específica
   * @param {number} quoteId - ID da cotação a ser cancelada
   * @returns {Promise<Object>} - Resposta da API
   */
  cancelQuote: async (quoteId) => {
    const response = await api.post(`/quote/${quoteId}/cancel`);
    return response.data;
  }
};

export default quoteService;