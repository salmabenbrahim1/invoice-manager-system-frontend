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
    const formData = new FormData();

    if (updatedData.invoiceName) {
      formData.append("invoiceName", updatedData.invoiceName);
    }
    if (updatedData.status) {
      formData.append("status", updatedData.status);
    }
    if (updatedData.folderId) {
      formData.append("folderId", updatedData.folderId);
    }
    if (updatedData.file) {
      formData.append("file", updatedData.file);
    }

    const response = await axios.put(`${API_URL}/${invoiceId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
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
    const response = await axios.put(`${API_URL}/${invoiceId}/status?status=${status}`, "N/A", {
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
        sellerName: extracted.sellerName || 'N/A',
        sellerAddress: extracted.sellerAddress || 'N/A',
        sellerPhone: extracted.sellerPhone || 'N/A',
        sellerEmail: extracted.sellerEmail || 'N/A',


        customerName: extracted.customerName || 'N/A',
        customerAddress: extracted.customerAddress || 'N/A',
        customerPhone: extracted.customerPhone || 'N/A',
        customerEmail: extracted.customerEmail || 'N/A',

        invoiceNumber: extracted.invoiceNumber || 'N/A',
        invoiceDate: extracted.invoiceDate || 'N/A',
        dueDate: extracted.dueDate || 'N/A',
        currency: extracted.currency || 'N/A',

        tva: extracted.tva || 'N/A',
        tvaNumber: extracted.tvaNumber || 'N/A',
        tvaRate: extracted.tvaRate || 'N/A',
        ht: extracted.ht || 'N/A',
        ttc: extracted.ttc || 'N/A',
        discount: extracted.discount || 'N/A',
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
        sellerSiretNumber: sellerInformation.sellerSiretNumber || 'N/A',
        sellerName: sellerInformation.sellerName || 'N/A',
        sellerAddress: sellerInformation.sellerAddress || 'N/A',
        sellerPhone: sellerInformation.sellerPhone || 'N/A',

        customerName: customerInformation.customerName || 'N/A',
        customerAddress: customerInformation.customerAddress || 'N/A',
        customerPhone: customerInformation.customerPhone || 'N/A',

        invoiceNumber: invoiceMetadata.invoiceNumber || 'N/A',
        invoiceDate: invoiceMetadata.invoiceDate || 'N/A',
        dueDate: invoiceMetadata.dueDate || 'N/A',
        currency: invoiceMetadata.currency || 'N/A',

        tva: amounts.tva || 'N/A',
        tvaNumber: amounts.tvaNumber || 'N/A',
        tvaRate: amounts.tvaRate || 'N/A',
        ht: amounts.ht || 'N/A',
        ttc: amounts.ttc || 'N/A',
        discount: amounts.discount || 'N/A',
      };
    }

    const isEmpty = Object.values(structuredData).every(val => val === 'N/A');
    if (isEmpty) throw new Error('No usable data returned from extraction');

    return structuredData;
  } catch (error) {
    console.error(" Error in extractInvoiceData:", error);
    throw error;
  }
};





export default invoiceService;
