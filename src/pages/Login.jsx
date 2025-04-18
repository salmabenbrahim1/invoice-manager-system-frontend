import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import imagesWebsite from '../assets/images/imagesWebsite.png';
import { validateEmail, loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import InfoModal from "../components/modals/InfoModal";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim();

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }

    try {
      const userData = await loginService(trimmedEmail, password);

      if (!userData?.token) {
        setError('Incorrect email or password.');
        return;
      }

      // Save user session
      login(userData.email, userData.role, userData.token);

      // Navigate based on role
      const roleRouteMap = {
        ADMIN: '/admin',
        COMPANY: '/company',
        'INDEPENDENT ACCOUNTANT': '/accountant',
        CLIENT: '/client',
      };

      const route = roleRouteMap[userData.role];

      if (route) {
        navigate(route);
      } else {
        setError('Unrecognized role.');
      }

    } catch (err) {
      const message = err.message || 'An unexpected error occurred.';

      if (message.includes('desactivated')) {
        setModalMessage(
          'Your account has been deactivated by the admin. Please contact support for more info.'
        );
        setIsModalOpen(true);
      } else {
        setError(message);
      }

    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalMessage('');
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Login</h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-700">
            Welcome! Please enter your details.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-base font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2.5 border rounded-xl border-gray-300 focus:ring-2 focus:ring-[#75529e] focus:outline-none placeholder:text-gray-400"
                placeholder="name@gmail.com"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-base font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2.5 border rounded-xl border-gray-300 focus:ring-2 focus:ring-[#75529e] focus:outline-none placeholder:text-gray-400"
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 text-red-500 text-sm sm:text-base">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-800 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Modal for Info */}
      <InfoModal
        show={isModalOpen}
        onHide={handleModalClose}
        title="Account Status"
        message={modalMessage}
      />
    </div>
  );
};

export default Login;
