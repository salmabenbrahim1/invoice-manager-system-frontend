import axios from 'axios';

const api = axios.create({
  //backend URL
  baseURL: 'http://localhost:9090/api'
});

//Fetch invoices for each folder
export const getInvoices = async (folderId) => {
  try {
    const response = await api.get(`/folders/${folderId}/invoices`);
    return response.data || []; 
  }catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

//Add an invoice to the current folder
export const createInvoice = async (folderId, formData) => {
  try {
    const response = await api.post(`/folders/${folderId}/invoices`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice - Details:", {
    
    });
    throw error;
  }
};

//Update an invoice in the current folder
export const updateInvoice = async (folderId,invoiceId, updatedData) => {
  try {
    const response = await api.put(`folders/${folderId}/invoices/${invoiceId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

// Delete an invoice in the current folder
export const deleteInvoice = async (folderId,invoiceId) => {
  try {
    await api.delete(`folders/${folderId}/invoices/${invoiceId}`);
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};





