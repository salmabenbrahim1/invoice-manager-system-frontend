import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Nouveau état pour gérer le chargement
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

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
        name: name,
      });
    } else {
      setUser(null);
    }
    setLoading(false);  // Une fois que le token a été vérifié, on marque le chargement comme terminé
  };

  const login = (email, role, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);

    const decodedToken = jwtDecode(token);
    const { firstName, lastName, companyName } = decodedToken;
    let name = '';

    if (role === 'COMPANY') {
      name = companyName;
    } else if (firstName && lastName) {
      name = `${firstName} ${lastName}`;
    } else {
      name = email;
    }

    setUser({ email, role, name });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem('email', updatedUser.email);
    localStorage.setItem('role', updatedUser.role);
    localStorage.setItem('authToken', updatedUser.token);
  };

  useEffect(() => {
    checkToken();
  }, []);  // Se lance uniquement au montage du composant

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {!loading && children}  {/* Si l'état utilisateur est chargé, afficher les enfants */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
