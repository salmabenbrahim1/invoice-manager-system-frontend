import React from "react";
import { exportInvoiceToCSV } from "../../utils/exportToCSV";

const InvoiceSavedViewer = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const statusColors = {
    Paid: { bg: "bg-green-100", text: "text-green-800" },
    Pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    Overdue: { bg: "bg-red-100", text: "text-red-800" },
    Draft: { bg: "bg-gray-100", text: "text-gray-800" },
  };

  return (
    <div className="fixed inset-0 z-[1001] bg-black bg-opacity-50 flex items-start justify-center pt-20 pb-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-3xl max-w-6xl max-h-[90vh] flex overflow-hidden">
        <div className="w-1/2 bg-gray-50 flex items-center justify-center p-4 overflow-auto">
          {invoice.img ? (
            <img
              src={`http://localhost:9090${invoice.img}`}
              alt="Invoice"
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
          ) : (
            <div className="text-gray-400 italic">No invoice image available</div>
          )}
        </div>

        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-100 z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
              <p className="text-sm text-gray-500 mt-1">#{invoice.invoiceNumber || "N/A"}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-auto flex-1">
            <div className="space-y-4">
              <Section title="Invoice Information" color="blue" items={[
                { label: "Invoice Name", value: invoice.invoiceName },
                { label: "Status", value: invoice.status, badge: true },
                { label: "Date Added", value: invoice.addedAt },
                { label: "Invoice Date", value: invoice.invoiceDate },
                { label: "Due Date", value: invoice.dueDate },
              ]} colors={statusColors} />

              <Section title="Seller Details" color="purple" items={[
                { label: "Name", value: invoice.sellerName },
                { label: "Address", value: invoice.sellerAddress, isAddress: true },
                { label: "SIRET", value: invoice.sellerSiretNumber },
              ]} />

              <Section title="Customer Details" color="green" items={[
                { label: "Name", value: invoice.customerName },
                { label: "Address", value: invoice.customerAddress, isAddress: true },
              ]} />

              <Section title="Tax Information" color="amber" items={[
                { label: "TVA", value: invoice.tva },
                { label: "TVA Rate", value: invoice.tvaRate },
                { label: "TVA Number", value: invoice.tvaNumber },
                { label: "HT Amount", value: invoice.ht },
              ]} />

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Total Amount</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {invoice.ttc} {invoice.currency}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white p-2 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => exportInvoiceToCSV(invoice)}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, items, color, colors }) => (
  <div className={`bg-${color}-50/80 p-4 rounded-lg`}>
    <h3 className={`font-semibold text-${color}-800 border-b border-${color}-200 pb-2 mb-3`}>{title}</h3>
    <div className="space-y-3">
      {items.map((item, index) => (
        <DetailItem key={index} {...item} colors={colors} />
      ))}
    </div>
  </div>
);

const DetailItem = ({ label, value, badge = false, isAddress = false, colors }) => {
  return (
    <div className={`flex ${isAddress ? 'items-start' : 'items-center'}`}>
      <span className="text-sm font-medium text-gray-700 flex-shrink-0 mr-2">{label}:</span>
      {badge ? (
        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${colors?.[value]?.bg || "bg-gray-100"} ${colors?.[value]?.text || "text-gray-800"}`}>{value}</span>
      ) : (
        <span className={`text-sm font-semibold text-gray-900 ${isAddress ? "whitespace-pre-line break-words" : "whitespace-nowrap"}`}>{value || "-"}</span>
      )}
    </div>
  );
};

export default InvoiceSavedViewer;
