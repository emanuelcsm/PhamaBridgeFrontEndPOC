import api from '../api/api';

/**
 * Serviço para gerenciar operações relacionadas a cotações
 */
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
  getPharmacyQuotes: async (status = "") => {
    let url = status === "Pending" ? '/quote/listpending' : '/quote/pharmacy/list';
    if (status && status !== "Pending") {
      url += `?status=${status}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  /**
   * Busca os detalhes de uma cotação específica, incluindo a imagem da prescrição
   * @param {number} quoteId - ID da cotação
   * @returns {Promise<Object>} - Detalhes da cotação com URL da imagem
   */
  getQuoteDetails: async (quoteId) => {
    try {
      // Busca os detalhes da cotação
      const quoteResponse = await api.get(`/quote/${quoteId}`);
      const quoteData = quoteResponse.data;
      
      // Se há um ID de imagem de prescrição, busca a imagem
      if (quoteData.prescriptionImageId) {
        try {
          // Busca o blob da imagem da prescrição
          const imageBlob = await api.getBlob(`/prescription/${quoteData.prescriptionImageId}/image`);
          
          // Cria uma URL para o blob
          const imageUrl = URL.createObjectURL(imageBlob);
          
          // Retorna os dados da cotação com a URL da imagem
          return {
            ...quoteData,
            image: imageUrl
          };
        } catch (imageError) {
          console.error('Erro ao buscar imagem da prescrição:', imageError);
          // Retorna os dados da cotação sem a imagem
          return quoteData;
        }
      }
      
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