import axios from "axios";

const API_URL = "http://localhost:9090/api/auth";

export const validateToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Unauthorized (token expired)
      const newToken = await refreshToken();
      if (newToken) {
        return await validateToken(newToken); // Retry validation with new token
      }
    }
    console.error("Token validation failed:", error);
    return null;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, refreshToken, role, email: userEmail } = response.data;

    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return {
      token,
      refreshToken,
      role,
      email: userEmail,
      ...response.data 
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data?.message || "Login failed. Please check your credentials.";
  }
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return null;

  try {
    const response = await axios.post(`${API_URL}/refresh-token`, null, {
      headers: {
        Authorization: `Bearer ${refresh}`,
      },
    });
    const { token: newAccessToken } = response.data;

    localStorage.setItem("authToken", newAccessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    logout();
    return null;
  }
};


export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  delete axios.defaults.headers.common['Authorization'];
};
