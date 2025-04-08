
import axios from 'axios';

const API_URL = "http://localhost:9090/api/users";
const APIDash_URL = "http://localhost:9090/api/users/dashboard";

export const fetchUserStats = async () => {
  try {
    const response = await axios.get(APIDash_URL); 
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user statistics');
  }
};
export const fetchUsers = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch users");
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete user");
        return response;
    } catch (error) {
        throw error;
    }
};

export const saveUser = async (userData, userId = null) => {
    const method = userId ? "PUT" : "POST";
    const url = userId ? `${API_URL}/${userId}` : API_URL;

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Failed to save user");
        return await response.json();
    } catch (error) {
        throw error;
    }
};
