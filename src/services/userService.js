import axios from 'axios';

const API_URL = "http://localhost:9090/api/users";
const APIDash_URL = "http://localhost:9090/api/users/dashboard";

// Fetch dashboard stats
export const fetchUserStats = async () => {
  try {
    const response = await axios.get(APIDash_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user statistics');
  }
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

// Create a user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

// Update a user
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};
