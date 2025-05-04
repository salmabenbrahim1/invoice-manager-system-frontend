import axios from 'axios';

const API_URL = 'http://localhost:9090/api/auth';

// Function to get the stored access token
const getAccessToken = () => localStorage.getItem('authToken');

// Function to set the access token in headers and localStorage
const setAccessToken = (token) => {
  localStorage.setItem('authToken', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Function to get the stored refresh token
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Function to set the refresh token in localStorage
const setRefreshToken = (refreshToken) => {
  localStorage.setItem('refreshToken', refreshToken);
};

// Validate the access token and refresh if necessary
export const validateToken = async () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Token is valid
  } catch (error) {
    if (error.response?.status === 401) {
      // Unauthorized (token expired), attempt to refresh
      const newToken = await refreshToken();
      if (newToken) {
        return await validateToken(); // Retry validation with new token
      }
    }
    console.error('Token validation failed:', error);
    return null;
  }
};

// Login method
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, refreshToken, role, email: userEmail } = response.data;

    setAccessToken(token); // Store access token
    setRefreshToken(refreshToken); // Store refresh token
    localStorage.setItem('role', role);
    localStorage.setItem('email', userEmail);

    return {
      token,
      refreshToken,
      role,
      email: userEmail,
      ...response.data,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data?.message || 'Login failed. Please check your credentials.';
  }
};

// Refresh the access token using the refresh token
export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_URL}/refresh-token`, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    const { token: newAccessToken } = response.data;

    setAccessToken(newAccessToken); // Store new access token
    return newAccessToken;
  } catch (error) {
    console.error('Refresh token failed:', error);
    logout(); // Log out if refreshing the token fails
    return null;
  }
};

// Logout the user (clear tokens and reset headers)
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  delete axios.defaults.headers.common['Authorization'];
};
