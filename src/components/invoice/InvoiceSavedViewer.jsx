const InvoiceSavedViewer = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
              <p className="text-sm text-gray-500 mt-1">Invoice Number #{invoice.invoiceNumber}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Invoice Information</h3>
                <div className="space-y-2">
                  <DetailItem label="Invoice Name" value={invoice.invoiceName} />
                  <DetailItem label="Status" value={invoice.status} badge />
                  <DetailItem label="Date Added" value={invoice.addedAt} />
                  <DetailItem label="Invoice Date" value={invoice.invoiceDate} />
                  <DetailItem label="Due Date" value={invoice.dueDate} />
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Seller Details</h3>
                <div className="space-y-2">
                  <DetailItem label="Name" value={invoice.sellerName} />
                  <DetailItem label="Address" value={invoice.sellerAddress} />
                  <DetailItem label="SIRET Number" value={invoice.sellerSiretNumber} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Customer Details</h3>
                <div className="space-y-2">
                  <DetailItem label="Name" value={invoice.customerName} />
                  <DetailItem label="Address" value={invoice.customerAddress} />
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-2">Tax Information</h3>
                <div className="space-y-2">
                  <DetailItem label="TVA" value={invoice.tva} />
                  <DetailItem label="TVA Rate" value={invoice.tvaRate} />
                  <DetailItem label="TVA Number" value={invoice.tvaNumber} />
                  <DetailItem label="HT Amount" value={invoice.ht} />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Total Amount</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {invoice.ttc} <span className="text-lg font-medium text-gray-500">TTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent detail items
const DetailItem = ({ label, value, badge = false }) => (
  <div className="flex justify-between">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    {badge ? (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
        value === 'Paid' ? 'bg-green-100 text-green-800' : 
        value === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    ) : (
      <span className="text-sm text-gray-800">{value || '-'}</span>
    )}
  </div>
);

export default InvoiceSavedViewer;