import React, { createContext, useState, useEffect, useContext } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

// Function to check if the JWT token is expired
const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // If the token is invalid, we consider it as expired

    }
  };

// Checking the token in localStorage
const checkToken = () => {
  const token = localStorage.getItem('authToken');
  if (token && !isTokenExpired(token)) {
      const decoded = jwtDecode(token);
      let name = '';
      if (decoded.role === 'COMPANY') {
          name = decoded.companyName;
      } else if (decoded.firstName && decoded.lastName) {
          name = `${decoded.firstName} ${decoded.lastName}`;
      } else {
          name = decoded.email;
      }

      setUser({
          email: decoded.email,
          role: decoded.role,
          name: name
      });
  } else {
      setUser(null);
  }
};

// Login function
const login = (email, role, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);

    const decodedToken = jwtDecode(token); // Decode the token to extract the information

    const { firstName, lastName, companyName } = decodedToken;

    if (role === 'COMPANY') {
      setUser({ email, role, name: companyName });  // For a company, we display the company name

    } else if (role === 'INDEPENDENT_ACCOUNTANT') {
      setUser({ email, role, name: `${firstName} ${lastName}` });  
    } else {
      setUser({ email, role });  
    }
  };

// Logout function
    const logout = () => {
    localStorage.clear(); 
    setUser(null); 
    navigate('/login'); 
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);  // Met à jour le state `user`
  
    // update `localStorage`
    localStorage.setItem('email', updatedUser.email);
    localStorage.setItem('role', updatedUser.role);
    localStorage.setItem('authToken', updatedUser.token);
  
  };
  useEffect(() => {
    checkToken();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
  
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
