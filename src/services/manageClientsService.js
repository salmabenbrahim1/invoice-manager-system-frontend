import axios from "axios";

const API_URL = "http://localhost:9090/api/clients"; 

// Fetch all clients
export const fetchClients = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
};

// Add or update a client
export const saveClient = async (clientData, clientId = null) => {
    try {
        if (clientId) {
            // Update an existing client
            const response = await axios.put(`${API_URL}/${clientId}`, clientData);
            return response.data;
        } else {
            // Add a new client
            const response = await axios.post(API_URL, clientData);
            return response.data;
        }
    } catch (error) {
        console.error("Error adding/updating the client:", error);
        throw error;
    }
};

// Delete a client
export const deleteClient = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting the client:", error);
        throw error;
    }
};
