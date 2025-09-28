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

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
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

export const requestPasswordRecovery = async (email) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/recover-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao solicitar recuperação de senha');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    throw error;
  }
};

export default authService;