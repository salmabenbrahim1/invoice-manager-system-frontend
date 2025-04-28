import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext'; // Import your auth context

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth(); // Get current user from auth context

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await userService.getUserStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (userData, id) => {
    setLoading(true);
    try {
      let user;
      if (id) {
        user = await userService.updateUser(id, userData);
        setUsers(prev => prev.map(u => u.id === id ? user : u));
      } else {
        user = await userService.createUser(userData);
        setUsers(prev => [...prev, user]);
      }
      return user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleActivation = async (id) => {
    setLoading(true);
    try {
      await userService.toggleUserActivation(id);
      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, active: !u.active } : u
      ));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    if (currentUser) { // Only fetch if authenticated
      fetchUsers();
      fetchStats();
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{
      users,
      stats,
      currentUser,
      loading,
      error,
      saveUser,
      deleteUser,
      toggleActivation,
      refreshUsers: fetchUsers,
      refreshStats: fetchStats,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);