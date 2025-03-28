import axios from 'axios';

const API_URL = 'http://localhost:9090/api/auth/login';

// Function to validate email format using a regular expression
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Login function to authenticate a user with email and password
export const login = async (email, password) => {
  try {
    // Sending a POST request to the server for authentication
    const response = await axios.post(API_URL, { email, password });
    return response.data; // Return the response data from the server
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('An error occurred during login');
  }
};
