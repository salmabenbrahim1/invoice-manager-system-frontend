import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchUsers, createUser,deleteUser, updateUser, toggleUserActivation } from "../services/userService";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsersData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);


  // Save (create or update) a user
  const handleSaveUser = async (userData, userId) => {
    setLoading(true);
    try {
      if (userId) {
        await updateUser(userId, userData);
        await fetchUsersData(); // Fetch users after updating
        toast.success("User updated successfully!");
      } else {
        await createUser(userData);
        await fetchUsersData(); // Fetch users after creating
        toast.success("User added successfully!");
        setTimeout(() => toast.info("Email sent successfully!"), 500);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(userId ? "Error updating the user." : "Error adding the user.");
    } finally {
      setLoading(false);
    }
  };
  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter(user => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting the user.");
    }
  };
  const handleDeactivateUser = async (userId, shouldActivate) => {
    try {
     await toggleUserActivation(userId);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: shouldActivate } : user
      ));
      toast.success(
        shouldActivate 
          ? "User has been successfully activated" 
          : "User has been successfully deactivated"
      );
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        handleDeleteUser,
        handleSaveUser,
        handleDeactivateUser,
        fetchUsersData,

      }}
    >
      {children}
    </UserContext.Provider>
  );
};

