import  { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);


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

  // get internal accountants
  const getInternalAccountants = () => {
    return users.filter(user => user.role === 'INTERNAL_ACCOUNTANT');
  };

  

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  // Fetch user statistics
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

// Check if email exists
  const checkEmailExists = async (email) => {
    try {
      return await userService.checkEmailExists(email); 
    } catch (error) {
      console.error('Email check failed:', error);
      throw error;
    }
  };


  // Save user (create or update)
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
          updatedData.fiscalNumber = userData.ficalNumber;
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
        emailSent = response.emailSent; 
        subject = response.subject || "No subject";
        body = response.body || "No body";
        setUsers(prev => [...prev, user]);

      }

      return { user, emailSent, subject, body };
    } catch (err) {
      console.error('Error saving user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Delete user error:', err);
      toast.error(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle user activation
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
const loadProfile = async () => {
  try {
    setLoading(true);
    const data = await userService.getCurrentProfile();
    setProfile(data);
    setError(null);
  } catch (err) {
    console.error("Failed to load profile", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
const updateProfile = async (profileData) => {
  try {
    await userService.updateProfile(profileData);
    const freshProfile = await userService.getCurrentProfile(); 
    setProfile(freshProfile);
    return freshProfile;
  } catch (err) {
    console.error("Update profile error:", err);
    throw err;
  }
};
const fetchCompanyAccountants = async (companyId) => {
  try {
    return await userService.getInternalAccountantsByCompanyId(companyId);
  } catch (error) {
    console.error('Failed to fetch accountants:', error);
    throw error;
  }
};


useEffect(() => {
  if (currentUser) {
    loadProfile();
  }
}, [currentUser]);


  // Fetch users and stats when the component mounts or when currentUser changes
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
      profile,
      loadProfile,         
    updateProfile,

      getInternalAccountants,
      fetchCompanyAccountants
      
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);