import { useState, createContext, useContext, useCallback} from 'react';
import { getInvoices, createInvoice, deleteInvoice } from '../services/InvoiceService';
import { useFolder } from './FolderContext';

import { toast } from 'react-toastify';

const InvoiceContext = createContext();

export const useInvoice = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  
  //// States to manage loading and error states:
  // Loading state to show a spinner 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(Date.now());
  
  const { currentFolder } = useFolder();

  //useCallback to fetch invoices when the folder changes
  // This will prevent unnecessary re-renders and API calls
  const fetchInvoices = useCallback(async (folderId) => {
    if (!folderId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const fetchedInvoices = await getInvoices(folderId);
      setInvoices(fetchedInvoices);
      
      // Updating last updated time
      setLastUpdated(Date.now());

    } catch (error) {
      setError(error);
      toast.error('Failed to load invoices');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //adding invoice to the corresponding folder
  const handleAddInvoice = async (folderId, formData) => {
    let newInvoice; 
    
    try {
      setIsLoading(true);
      newInvoice = await createInvoice(folderId, formData);
      
      setInvoices(prev => [...prev, newInvoice]);
      
      // Verify with server
      await fetchInvoices(folderId);
      
      toast.success('Invoice uploaded successfully');
      return newInvoice;

    } catch (error) {

     //newInvoice is defined
      if (newInvoice) {
        setInvoices(prev => prev.filter(invoice => invoice.id !== newInvoice.id));
      }
      toast.error('Failed to add an invoice');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

//deleting invoice from the folder
 const handleDeleteInvoice = async (invoiceId) => {

  try {
    setIsLoading(true);

    await deleteInvoice(currentFolder.id, invoiceId);
    setInvoices(prev => prev.filter(i => i.id !== invoiceId));

  } catch (error) {
    toast.error('Failed to delete invoice');
    console.error('Delete error:', error);
    setError(error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  return (
    <InvoiceContext.Provider 
      value={{ 
        invoices, 
        isLoading,
        setIsLoading,
        error,
        currentFolderId: currentFolder?.id,
        fetchInvoices,
        handleAddInvoice, 
        handleDeleteInvoice,
        lastUpdated
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};