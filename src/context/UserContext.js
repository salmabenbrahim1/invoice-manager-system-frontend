import { createContext, useContext, useState, useEffect } from "react";
import { fetchUsers, deleteUser, saveUser } from "../services/userService";
import { toast } from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            setUsers(data);
        } catch (error) {
            setError("Error fetching users.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            fetchUsersData();
            toast.success("User deleted successfully!");
        } catch (error) {
            toast.error("Error deleting the user.");
        }
    };

    const handleSave = async (userData, userId = null) => {
        try {
            setLoading(true);
            setError(null);
            await saveUser(userData, userId);
            fetchUsersData();
            toast.success(userId ? "User updated successfully!" : "User added successfully!");
            setTimeout(() => toast.info("Email sent successfully!"), 500);
        } catch (error) {
            toast.error(userId ? "Error updating the user." : "Error adding the user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ users, loading, error, handleDelete, handleSave }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUsers must be used within a UserProvider");
    }
    return context;
};
