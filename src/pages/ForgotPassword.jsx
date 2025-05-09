import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import imagesWebsite from '../assets/images/imagesWebsite.png';
import InfoModal from '../components/modals/InfoModal';
import { useForgotPassword } from '../context/ForgotPasswordContext';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    loading,
    message,
    resetPassword,
  } = useForgotPassword();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side (Image) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-5/12 bg-[#75529e] p-6 sm:p-10 md:p-16 flex items-center justify-center"
      >
        <img
          src={imagesWebsite}
          alt="MyInvoice App Preview"
          className="w-full h-auto max-w-md"
        />
      </motion.div>

      {/* Right Side (Form) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-7/12 bg-white dark:bg-gray-900 p-6 sm:p-10 md:p-16 flex items-center justify-center"
      >
        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Forgot Password</h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Please enter your email address to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-base font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2.5 border rounded-xl border-gray-300 focus:ring-2 focus:ring-[#75529e] focus:outline-none placeholder:text-gray-400"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </form>

          <div className="mt-4 text-right">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-[#75529e] hover:underline"
            >
              Back to Login
            </button>
          </div>

        </div>
      </motion.div>

      {/* Info Modal */}
      <InfoModal
        show={isModalOpen}
        onHide={handleModalClose}
        title="Information"
        message={message}
      />
    </div>
  );
};

export default ForgotPassword;
