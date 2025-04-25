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
      const response = await axios.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
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

  // Toggle user activation
  toggleUserActivation: async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle-activation`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to toggle activation');
    }
  },

  // Get user statistics (admin only)
  getUserStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Helper function to check permissions (mirrors backend logic)
  canManage: (currentUser) => {
    return currentUser?.role === 'ADMIN' || currentUser?.role === 'COMPANY';
  },

  // Helper function to check view permissions
  canView: (currentUser, targetUser) => {
    if (currentUser?.role === 'ADMIN') return true;
    return targetUser?.createdBy === currentUser?.id;
  }
};

