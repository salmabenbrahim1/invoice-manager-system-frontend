import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Fetch users error:', err);
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
      console.error('Fetch stats error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const checkEmailExists = async (email) => {
    try {
      return await userService.checkEmailExists(email); // Calls service with token header
    } catch (error) {
      console.error('Email check failed:', error);
      throw error;
    }
  };


  const saveUser = async (userData, id) => {
    setLoading(true);
    try {
      let user;
      let emailSent = false;
      let subject = "";   
      let body = "";
      if (id) {
        const existingUser = users.find(u => u.id === id);
        if (!existingUser) throw new Error('User not found');

        const updatedData = {
          ...userData,
          id: id,
          role: existingUser.role,
          active: existingUser.active
        };

        if (existingUser.role === 'COMPANY') {
          updatedData.companyName = userData.companyName;
        } else {
          updatedData.firstName = userData.firstName;
          updatedData.lastName = userData.lastName;
          updatedData.gender = userData.gender;
          updatedData.cin = userData.cin;
        }

        user = await userService.updateUser(id, updatedData);
        setUsers(prev => prev.map(u => u.id === id ? user : u));
      } else {
        const response = await userService.createUser(userData);
        user = response.user;
        emailSent = response.emailSent;  // Extract email sent status from the response
       subject = response.subject || "No subject"; 
       body=response.body || "No body";       
       setUsers(prev => [...prev, user]);
      }

      return { user, emailSent, subject ,body}; 
        } catch (err) {
      console.error('Error saving user:', err);
      toast.error(err.message || 'Failed to save user');
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
      toast.success("User deleted successfully");
    } catch (err) {
      console.error('Delete user error:', err);
      toast.error(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleActivation = async (id) => {
    setLoading(true);
    try {
      const updatedUser = await userService.toggleUserActivation(id);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));

      if (updatedUser?.active) {
        toast.success("User account has been activated successfully");
      } else {
        toast.success("User account has been deactivated successfully");
      }
    } catch (err) {
      console.error('Toggle Activation Error:', err);
      toast.error(err.message || "Failed to toggle activation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
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
      checkEmailExists,
      
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);