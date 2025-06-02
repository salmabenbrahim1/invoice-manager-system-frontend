import axios from 'axios';

const API_URL = 'http://localhost:9090/api/users';
const API_URL_stats = 'http://localhost:9090/api/dashboard';
// Get auth config
const getAuthConfig = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const userService = {
  // Create a new user
  createUser: async (userData) => {
    try {
      const config = getAuthConfig();   // Get the authentication header config
      const response = await axios.post(API_URL, userData, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'User not found');
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.put(`${API_URL}/${id}`, userData, config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update user';
      throw new Error(errorMessage);
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/${id}`, config);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Toggle activation status
  toggleUserActivation: async (id) => {
    try {
      const config = getAuthConfig();
      const response = await axios.patch(`${API_URL}/${id}/toggle-activation`, {}, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to toggle activation');
    }
  },

  // Check if email exists (with authorization)
  checkEmailExists: async (email) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL}/check-email`, {
        params: { email },
        ...config 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check email');
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL_stats}`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
  },


// Get current user's profile
getCurrentProfile: async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
},

updateProfile: async (formData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.put(`${API_URL}/profile`, formData, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
},
getInternalAccountantsByCompanyId: async (companyId) => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/companies/${companyId}/accountants`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch accountants');
  }
},



  

  
  // Permission checks
  canManage: (currentUser) => {
    return currentUser?.role === 'ADMIN' || currentUser?.role === 'COMPANY';
  },

  canView: (currentUser, targetUser) => {
    if (currentUser?.role === 'ADMIN') return true;
    return targetUser?.createdBy === currentUser?.id;
  }
};