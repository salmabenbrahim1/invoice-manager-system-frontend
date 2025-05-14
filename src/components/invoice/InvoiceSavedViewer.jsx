const InvoiceSavedViewer = ({ invoice, onClose }) => {
  if (!invoice) return null;

  // Status color mapping
  const statusColors = {
    Paid: { bg: "bg-green-100", text: "text-green-800" },
    Pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    Overdue: { bg: "bg-red-100", text: "text-red-800" },
    Draft: { bg: "bg-gray-100", text: "text-gray-800" },
  };

  

  return (
    <div className="fixed inset-0 z-[1001] bg-black bg-opacity-50 flex items-start justify-center pt-20 pb-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-3xl  max-w-3xl max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-100 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                #{invoice.invoiceNumber || "N/A"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Invoice Info */}
              <div className="bg-blue-50/80 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-3">
                  Invoice Information
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Invoice Name" value={invoice.invoiceName} />
                  <DetailItem label="Status" value={invoice.status} badge colors={statusColors} />
                  <DetailItem label="Date Added" value={invoice.addedAt} />
                  <DetailItem label="Invoice Date" value={invoice.invoiceDate} />
                  <DetailItem label="Due Date" value={invoice.dueDate} />
                </div>
              </div>

              {/* Seller Details */}
              <div className="bg-purple-50/80 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 border-b border-purple-200 pb-2 mb-3">
                  Seller Details
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Name" value={invoice.sellerName} />
                  <DetailItem label="Address" value={invoice.sellerAddress} isAddress />
                  <DetailItem label="SIRET" value={invoice.sellerSiretNumber} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Customer Details */}
              <div className="bg-green-50/80 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 border-b border-green-200 pb-2 mb-3">
                  Customer Details
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Name" value={invoice.customerName} />
                  <DetailItem label="Address" value={invoice.customerAddress} isAddress />
                </div>
              </div>

              {/* Tax Info */}
              <div className="bg-amber-50/80 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-3">
                  Tax Information
                </h3>
                <div className="space-y-3">
                  <DetailItem label="TVA" value={invoice.tva} />
                  <DetailItem label="TVA Rate" value={invoice.tvaRate} />
                  <DetailItem label="TVA Number" value={invoice.tvaNumber} />
                  <DetailItem label="HT Amount" value={invoice.ht} />
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  Total Amount
                </h3>
                <div className="text-2xl font-bold text-gray-900">
                  {invoice.ttc}{ invoice.currency}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated DetailItem component with address handling
const DetailItem = ({ label, value, badge = false, isAddress = false, colors }) => {
  return (
    <div className={`flex ${isAddress ? 'items-start' : 'items-center'}`}>
      <span className="text-sm font-medium text-gray-700 flex-shrink-0 mr-2">
        {label}:
      </span>
      {badge ? (
        <span
          className={`px-2.5 py-1 text-xs rounded-full font-medium ${
            colors?.[value]?.bg || "bg-gray-100"
          } ${colors?.[value]?.text || "text-gray-800"}`}
        >
          {value}
        </span>
      ) : (
        <span
          className={`text-sm font-semibold text-gray-900 ${
            isAddress ? "whitespace-pre-line break-words" : "whitespace-nowrap"
          }`}
        >
          {value || "-"}
        </span>
      )}
    </div>
  );
};

export default InvoiceSavedViewer;