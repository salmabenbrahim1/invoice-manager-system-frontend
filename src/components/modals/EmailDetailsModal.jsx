import React from "react";
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const EmailDetailsModal = ({ email, isOpen, onClose }) => {
  if (!isOpen || !email) return null;

  const isEmailFailed = email.status === "failed";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50 pt-16 pb-8">
      <div 
        className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[calc(101vh-9rem)] "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-2 border-b border-gray-200 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-gray-800">Email Details</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Recipient</p>
              <p className="text-gray-900 break-all">{email.email}</p>
            </div>
        
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className={`inline-flex items-center gap-1 ${
                email.status === "sent" ? "text-green-600" : "text-red-600"
              }`}>
                {email.status === "sent" ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Sent successfully
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Failed to send
                  </>
                )}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p className="text-gray-900">{email.subject}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Date Sent</p>
              <p className="text-gray-900">
                {new Date(email.date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {!isEmailFailed && (
            <div className="space-y-2 pt-4">
              <p className="text-sm font-medium text-gray-500">Message Content</p>
              <div 
                className="p-3 bg-gray-50 rounded border border-gray-200 prose max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: email.body }} 
              />
            </div>
          )}

          {isEmailFailed && (
            <div className="text-red-500 mt-4">
              <p className="text-sm font-medium">
                The email failed to send. Please try again later.
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white p-2.5 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

EmailDetailsModal.propTypes = {
  email: PropTypes.shape({
    email: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default EmailDetailsModal;
