import api from '../api/api';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/signin', { username, password });
      const userData = response.data;
      
      // Store token and user data in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, userData.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: userData.roles
      }));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getUserData: () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  hasRole: (role) => {
    const userData = authService.getUserData();
    return userData?.roles?.includes(role) || false;
  }
};

export default authService;