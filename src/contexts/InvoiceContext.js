import { createContext, useContext, useState } from 'react';
import InvoiceService from '../services/InvoiceService';

const InvoiceContext = createContext();

export const useInvoice = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);


  // Fetch invoices by folder ID
  const fetchInvoices = async (folderId) => {
  setLoading(true);
  setError(null);
  try {
    const fetchedInvoices = await InvoiceService.getInvoicesByFolder(folderId);
    setInvoices(fetchedInvoices);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch invoices');
  } finally {
    setLoading(false);
  }
};

// Fetch a single invoice by ID
const fetchInvoiceById = async (invoiceId) => {
  setLoading(true);
  setError(null);
  try {
    const invoice = await InvoiceService.getInvoiceById(invoiceId);
    setSelectedInvoice(invoice);
    return invoice;
  } catch (err) {
    setError('Failed to fetch invoice details');
    throw err;
  } finally {
    setLoading(false);
  }
};

// Create a new invoice
  const createInvoice = async (formData) => {
    setLoading(true);
    try {
      const newInvoice = await InvoiceService.createInvoice(formData);
      setInvoices((prev) => [...prev, newInvoice]);
    } catch (err) {
      setError('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing invoice
  const updateInvoice = async (invoiceId, updatedData) => {
    setLoading(true);
    try {
      const updatedInvoice = await InvoiceService.updateInvoice(invoiceId, updatedData);
      setInvoices((prev) =>
        prev.map((invoice) => (invoice.id === invoiceId ? updatedInvoice : invoice))
      );
    } catch (err) {
      setError('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  // Delete an invoice
  const deleteInvoice = async (invoiceId) => {
    setLoading(true);
    try {
      await InvoiceService.deleteInvoice(invoiceId);
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
    } catch (err) {
      setError('Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };


 

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        loading,
        error,
        fetchInvoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        fetchInvoiceById,
        selectedInvoice,
        setSelectedInvoice,
        
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
