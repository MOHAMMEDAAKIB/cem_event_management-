import axios from 'axios';

// Use the same pattern as the existing api.js but for admin routes
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('isAdminAuthenticated');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  // Login admin
  login: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      
      if (response.data.success) {
        const { token, admin } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        localStorage.setItem('isAdminAuthenticated', 'true');
        
        return {
          success: true,
          data: { token, admin }
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },

  // Register new admin (only for authenticated admins with permission)
  register: async (adminData) => {
    try {
      const response = await api.post('/register', adminData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return {
        success: true,
        data: response.data.data.admin
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile.'
      };
    }
  },

  // Update admin profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      
      // Update stored user data
      const updatedAdmin = response.data.data.admin;
      localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
      
      return {
        success: true,
        data: updatedAdmin,
        message: response.data.message
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.'
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/change-password', {
        currentPassword,
        newPassword
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password.'
      };
    }
  },

  // Get all admins (for admin management)
  getAdminList: async () => {
    try {
      const response = await api.get('/list');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get admin list error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch admin list.'
      };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.post('/verify-token');
      return {
        success: true,
        data: response.data.data.admin
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Token verification failed.'
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('isAdminAuthenticated');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    return !!(token && isAuth);
  },

  // Get current admin user
  getCurrentAdmin: () => {
    try {
      const adminUser = localStorage.getItem('adminUser');
      return adminUser ? JSON.parse(adminUser) : null;
    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  },

  // Get admin token
  getToken: () => {
    return localStorage.getItem('adminToken');
  }
};

// Legacy functions for backward compatibility
export const validateAdminLogin = async (username, password) => {
  const result = await authService.login(username, password);
  return result.success;
};

export const setAuthenticated = (status) => {
  localStorage.setItem('isAdminAuthenticated', status.toString());
};

export const isAuthenticated = () => {
  return authService.isAuthenticated();
};

export const logout = () => {
  authService.logout();
};

export default authService;
