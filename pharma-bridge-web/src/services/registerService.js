import api from '../api/api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

export const registerPharmacy = async (pharmacyData) => {
  try {
    const response = await api.post('/pharmacy/register', pharmacyData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar farmácia:', error);
    throw error;
  }
};