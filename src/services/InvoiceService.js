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

  //save the invoice after extraction
 saveInvoice : async (invoiceId, formData) => {
    try {
      const response = await axios.put(
        `http://localhost:9090/api/invoices/extracted/${invoiceId}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error('Error while saving the invoice.');
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

 // Update the status of an existing invoice
 updateInvoiceStatus: async (invoiceId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${invoiceId}/status?status=${status}`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
},

};

const API_AI_URL= 'http://localhost:5000/extract';

// Extracting structured invoice data using the OCR service
export const extractInvoiceData = async (imagePath) => {
  try {
    const response = await axios.post(API_AI_URL, {
      imageUrl: `http://localhost:9090${imagePath}`,
    });

    const extracted = response.data || {};

    // Using camelCase field names based on the updated Python output
    const structuredData = {
      sellerSiretNumber: extracted.sellerSiretNumber || 'null',
      invoiceNumber: extracted.invoiceNumber || 'null',
      invoiceDate: extracted.invoiceDate || 'null',
      dueDate: extracted.dueDate || 'null',
      currency: extracted.currency || 'null',

      sellerName: extracted.sellerName || 'null',
      sellerAddress: extracted.sellerAddress || 'null',
      sellerPhone: extracted.sellerPhone || 'null',
      customerName: extracted.customerName || 'null',
      customerAddress: extracted.customerAddress || 'null',
      customerPhone: extracted.customerPhone || 'null',
      tva : extracted.tva || 'null',
      tvaNumber: extracted.tvaNumber || 'null',
      tvaRate: extracted.tvaRate || 'null',
      ht: extracted.ht || 'null',
      ttc: extracted.ttc || 'null',
      discount: extracted.discount || 'null',
    };

     //Check if the extracted data contains usable information
    const isEmpty = Object.values(structuredData).every(val => val === 'null');
    if (isEmpty) throw new Error('No usable data returned from extraction');

    return structuredData;
  } catch (error) {
    console.error("Error in extractInvoiceData:", error);
    throw error;
  }
};






export default invoiceService;
