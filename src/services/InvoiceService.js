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
  // Get invoice by ID
 getInvoiceById: async (invoiceId) => {
  try {
    const response = await axios.get(`${API_URL}/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
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



export const extractInvoiceData = async (imagePath, selectedEngine) => {
  try {
    const response = await axios.post('http://localhost:5000/extract', {
      imageUrl: `http://localhost:9090${imagePath}`,
      engine: selectedEngine,
    });

    const extracted = response.data || {};
    if (!extracted) {
      throw new Error('No data returned from extraction');
    }

    //  (DeepSeek)
    const isFlatStructure = extracted.hasOwnProperty('invoiceNumber');

    let structuredData;

    if (isFlatStructure) {
      structuredData = {
        sellerSiretNumber: extracted.sellerSiretNumber || 'null',
        sellerName: extracted.sellerName || 'null',
        sellerAddress: extracted.sellerAddress || 'null',
        sellerPhone: extracted.sellerPhone || 'null',

        customerName: extracted.customerName || 'null',
        customerAddress: extracted.customerAddress || 'null',
        customerPhone: extracted.customerPhone || 'null',

        invoiceNumber: extracted.invoiceNumber || 'null',
        invoiceDate: extracted.invoiceDate || 'null',
        dueDate: extracted.dueDate || 'null',
        currency: extracted.currency || 'null',

        tva: extracted.tva || 'null',
        tvaNumber: extracted.tvaNumber || 'null',
        tvaRate: extracted.tvaRate || 'null',
        ht: extracted.ht || 'null',
        ttc: extracted.ttc || 'null',
        discount: extracted.discount || 'null',
      };
    } else {
      // (Gemini)
      const {
        invoiceMetadata = {},
        sellerInformation = {},
        customerInformation = {},
        amounts = {},
      } = extracted;

      structuredData = {
        sellerSiretNumber: sellerInformation.sellerSiretNumber || 'null',
        sellerName: sellerInformation.sellerName || 'null',
        sellerAddress: sellerInformation.sellerAddress || 'null',
        sellerPhone: sellerInformation.sellerPhone || 'null',

        customerName: customerInformation.customerName || 'null',
        customerAddress: customerInformation.customerAddress || 'null',
        customerPhone: customerInformation.customerPhone || 'null',

        invoiceNumber: invoiceMetadata.invoiceNumber || 'null',
        invoiceDate: invoiceMetadata.invoiceDate || 'null',
        dueDate: invoiceMetadata.dueDate || 'null',
        currency: invoiceMetadata.currency || 'null',

        tva: amounts.tva || 'null',
        tvaNumber: amounts.tvaNumber || 'null',
        tvaRate: amounts.tvaRate || 'null',
        ht: amounts.ht || 'null',
        ttc: amounts.ttc || 'null',
        discount: amounts.discount || 'null',
      };
    }

    const isEmpty = Object.values(structuredData).every(val => val === 'null');
    if (isEmpty) throw new Error('No usable data returned from extraction');

    return structuredData;
  } catch (error) {
    console.error(" Error in extractInvoiceData:", error);
    throw error;
  }
};





export default invoiceService;
