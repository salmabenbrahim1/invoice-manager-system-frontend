import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as authLogin, logout as authLogout, validateToken, refreshToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication state on initial load
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await validateToken(token);

      if (userData) {
        setUser({
          token,
          role: localStorage.getItem("role"),
          email: localStorage.getItem("email"),


          ...userData,
        });
      } else {
        // Attempt to refresh the token if expired
        const newToken = await refreshToken();
        if (newToken) {
          // Token refreshed, retry validating with new token
          const refreshedUserData = await validateToken(newToken);
          if (refreshedUserData) {
            setUser({
              token: newToken,
              role: localStorage.getItem("role"),
              email: localStorage.getItem("email"),


              ...refreshedUserData,
            });
          } else {
            authLogout(); // logout if refresh token is invalid or expired
            setUser(null);
            navigate('/login');
          }
        } else {
          authLogout(); // logout if refresh failed
          setUser(null);
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authLogout();
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await authLogin(email, password);
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("email", userData.email);
      setUser(userData);
      navigate('/dashboard'); // Navigate to the dashboard 
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authLogout();
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      setUser(null);  // Clear user state
      navigate('/login');  // Navigate to login page
    } catch (error) {
      console.error('Logout error:', error); // Handle any logout errors
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
