import React from 'react';
import ZoomableImage from '../ZoomableImage'; // Import the ZoomableImage component

const ImageInvoiceModal = ({ imgUrl, onClose, onScan }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center pt-8 pb-4">
    <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[calc(103vh-12rem)] overflow-auto shadow-xl">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center">
            Invoice Preview
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image Preview with ZoomableImage */}
        <div className="relative p-4 max-h-[60vh] overflow-hidden bg-gray-50">
          <ZoomableImage imgUrl={imgUrl} maxHeight="60vh" showDragHint={true} />
        </div>

        {/* Action Buttons - Adjusted to be closer */}
        <div className="px-2 py-2 bg-white border-t border-gray-100 flex gap-2 justify-end items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          <button
            onClick={onScan}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
          >
            Scan Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageInvoiceModal;
