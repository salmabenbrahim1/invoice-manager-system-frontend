import axios from 'axios';

const API_URL = 'http://localhost:9090/api/users';


export const userService = {
  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await axios.post(API_URL, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'User not found');
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      // Add authorization header
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.put(`${API_URL}/${id}`, userData, config);
      return response.data;
    } catch (error) {
      // Enhanced error handling
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update user';
      throw new Error(errorMessage);
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  toggleUserActivation: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/toggle-activation`);
      console.log('Updated user:', response.data); // Log the response data
      const updatedUser = response.data;
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to toggle activation');
    }
  },
  // Check if email exists (for registration)
  checkEmailExists: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/check-email`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check email');
    }
  },


  // Get user statistics 
  getUserStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
  },

  // Get current user profile
  updateCurrentUserProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/me`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
  
  
  

 // check permissions (mirrors backend logic)
  canManage: (currentUser) => {
    return currentUser?.role === 'ADMIN' || currentUser?.role === 'COMPANY';
  },

  // check view permissions
  canView: (currentUser, targetUser) => {
    if (currentUser?.role === 'ADMIN') return true;
    return targetUser?.createdBy === currentUser?.id;
  }
};

