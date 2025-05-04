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
const API_URL = 'http://localhost:5000/extract';
export const extractInvoiceData = async (imagePath) => {
  try {
    const response = await axios.post(API_URL, {
      imageUrl: `http://localhost:9090${imagePath}`,
    });

    const extracted = response.data || {};

    const structuredData = {
      siret_number: extracted.siret_number || 'N/A',
      invoice_number: extracted.invoice_number || 'N/A',
      TVA_Number: extracted['TVA Number'] || extracted.TVA_Number || 'N/A',
      invoice_date: extracted.document_date || extracted.invoice_date || 'N/A',
      TVA: extracted.TVA || 'N/A',
      HT: extracted.HT || 'N/A',
      TTC: extracted.TTC || 'N/A',
      client_name: extracted.client_name || 'N/A',
      currency: extracted.currency || 'N/A',
    };

    const isEmpty = Object.values(structuredData).every(val => val === 'N/A');
    if (isEmpty) throw new Error('No usable data returned from extraction');

    return structuredData;
  } catch (error) {
    console.error("Error in extractInvoiceData:", error);
    throw error;
  }
};