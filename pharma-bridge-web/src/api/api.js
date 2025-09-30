import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Função específica para buscar dados binários como imagens ou arquivos
 * @param {string} url - URL relativa para a API (sem baseURL)
 * @param {Object} options - Opções adicionais para a requisição
 * @returns {Promise<Blob>} - Retorna uma Promise que resolve com um blob
 */
api.getBlob = async (url, options = {}) => {
  try {
    // Usando axios diretamente para evitar conflitos com a instância personalizada
    const response = await axios.get(`${api.defaults.baseURL}${url}`, {
      ...options,
      responseType: 'blob',
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blob data:', error);
    throw error;
  }
};

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear localStorage and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;