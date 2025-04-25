import axios from "axios";
const API_URL = "http://localhost:9090/api/auth";

//  token validation
export const validateToken = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Token validation failed:", error);
    logout(); // Clear invalid token
    return null;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, role, email: userEmail } = response.data;

    // Store authentication data
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return {
      token,
      role,
      email: userEmail,
      ...response.data 
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data?.message || "Login failed. Please check your credentials.";
  }
};

export const logout = () => {
  // Clear all authentication data
  localStorage.removeItem("authToken");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  
  // Remove axios authorization header
  delete axios.defaults.headers.common['Authorization'];
};