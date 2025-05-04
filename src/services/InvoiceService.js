import axios from 'axios';


const API_URL = 'http://localhost:9090/api/invoices'; 

const invoiceService = {
  // Create a new invoice
  createInvoice: async (formData) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  

  // Get invoices by folder ID
  getInvoicesByFolder: async (folderId) => {
    try {
      const response = await axios.get(`${API_URL}/folder/${folderId}`);
      return response.data; // Return the list of invoices
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Update an existing invoice
  updateInvoice: async (invoiceId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${invoiceId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete an invoice by ID
  deleteInvoice: async (invoiceId) => {
    try {
      const response = await axios.delete(`${API_URL}/${invoiceId}`);
      return response.data; // Return a success message or status
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },
};
const API_URL1 = 'http://localhost:5000/extract';
export const extractInvoiceData = async (imagePath) => {
  try {
    const response = await axios.post(API_URL1, {
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
export default invoiceService;

