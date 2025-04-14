// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:9090/api/auth/login';

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const loginService = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    console.log('Login response:', response.data);
    
    return response.data; // { token, email, role }
  } catch (error) {
    throw new Error('An error occurred during login');
  }
};
