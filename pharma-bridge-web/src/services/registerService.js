import api from '../api/api';

/**
 * Serviço para registro de novos consumidores
 * @param {Object} userData - Dados do consumidor a ser registrado
 * @returns {Promise} Promessa com os dados do usuário registrado
 */
export const registerCustomer = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    
    // Melhora as mensagens de erro para o usuário
    if (error.response) {
      // O servidor respondeu com status diferente de 2xx
      if (error.response.status === 409) {
        throw new Error('Usuário ou email já cadastrado no sistema');
      } else if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Erro ao processar cadastro. Verifique seus dados e tente novamente.');
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
    } else {
      // Algo aconteceu na configuração da requisição
      throw new Error('Erro ao processar a requisição. Tente novamente mais tarde.');
    }
  }
};

/**
 * Serviço para registro de novas farmácias
 * @param {Object} pharmacyData - Dados da farmácia a ser registrada
 * @returns {Promise} Promessa com os dados da farmácia registrada
 */
export const registerPharmacy = async (pharmacyData) => {
  try {
    const response = await api.post('/pharmacy/register', pharmacyData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar farmácia:', error);
    
    // Melhora as mensagens de erro para o usuário
    if (error.response) {
      // O servidor respondeu com status diferente de 2xx
      if (error.response.status === 409) {
        throw new Error('CNPJ, usuário ou email já cadastrado no sistema');
      } else if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Erro ao processar cadastro. Verifique seus dados e tente novamente.');
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
    } else {
      // Algo aconteceu na configuração da requisição
      throw new Error('Erro ao processar a requisição. Tente novamente mais tarde.');
    }
  }
};