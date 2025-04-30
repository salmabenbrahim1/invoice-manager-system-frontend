import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as authLogin, logout as authLogout, validateToken } from '../services/authService';
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
        authLogout(); // just logout without redirect
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await authLogin(email, password);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
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
