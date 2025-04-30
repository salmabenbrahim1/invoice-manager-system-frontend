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

  // Get current user from auth context
  const { user: currentUser } = useAuth(); 

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
  const checkEmailExists = async (email) => {
    try {
      const response = await userService.checkEmailExists(email);
      return response; // true/false from server
    } catch (error) {
      console.error('Email check failed:', error);
      throw error;
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
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateCurrentUserProfile(profileData);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      toast.success("Profile successfully updated!");
      return updatedUser;
    } catch (err) {
      toast.error(err.message || "Profile update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  
  const saveUser = async (userData, id) => {
    setLoading(true);
    try {
      let user;
      if (id) {
        const userToUpdate = users.find(u => u.id === id);
        if (!userToUpdate) throw new Error('User not found');
  
        const updateData = {
          ...userData,
          id: id,
          role: userToUpdate.role, 
          active: userToUpdate.active // Maintain current active status
        };
  
        // Add role-specific fields
        if (userToUpdate.role === 'COMPANY') {
          updateData.companyName = userData.companyName;
        } else {
          updateData.firstName = userData.firstName;
          updateData.lastName = userData.lastName;
          updateData.gender = userData.gender;
          updateData.cin = userData.cin;
        }
  
        user = await userService.updateUser(id, updateData);
        setUsers(prev => prev.map(u => u.id === id ? user : u));
      } else {
        // For create, use the existing logic
        user = await userService.createUser(userData);
        setUsers(prev => [...prev, user]);
      }
      return user;
    } catch (err) {
      console.error('Error saving user:', err);
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
      // Wait for the response from the backend
      const updatedUser = await userService.toggleUserActivation(id);

      // Update the local state with the updated user's status
      setUsers(prev => prev.map(u => 
        u.id === id ? updatedUser : u
      ));

      // Show the correct toast based on the user's new active status
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


  // Initial data loading
  useEffect(() => {
    if (currentUser) { 
      // Only fetch if authenticated
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
      updateProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);