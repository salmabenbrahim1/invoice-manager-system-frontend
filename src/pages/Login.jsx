import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import imagesWebsite from '../assets/images/imagesWebsite.png';
import { validateEmail, loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import InfoModal from "../components/InfoModel";

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage the state of the modal
  const [modalMessage, setModalMessage] = useState(''); // The message to display in the modal

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!motDePasse) {
      setError('Please enter a password.');
      setLoading(false);
      return;
    }

    try {
      const userData = await loginService(email, motDePasse);
      if (userData.token) {
        login(userData.email, userData.role, userData.token);

        switch (userData.role) {
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'COMPANY':
            navigate('/company');
            break;
          case 'INDEPENDENT ACCOUNTANT':
            navigate('/my-folder');
            break;
          case 'CLIENT':
            navigate('/client');
            break;
          default:
            setError('Unrecognized role');
        }
      } else {
        setError('Incorrect email or password');
      }
    } catch (error) {
      setError(error.message);
      if (error.message === 'Your account has been deactivated by the admin.') {
        setModalMessage('Your account has been deactivated by the admin. Please contact the admin for further details.');
        setIsModalOpen(true); // Open the modal
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-5/12 bg-[#75529e] p-10 md:p-16 flex flex-col justify-center"
      >
        <div className="relative z-10">
          <img src={imagesWebsite} alt="MyInvoice App Preview" className="w-full h-auto" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-7/12 bg-white dark:bg-gray-900 p-10 md:p-16 flex items-center justify-center"
      >
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Login</h2>
          <p className="text-gray-800 dark:text-gray-300 mb-8">Welcome! Please enter your details.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="text-lg font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                placeholder="nom@gmail.com"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="text-lg font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                placeholder="••••••••"
                value={motDePasse}
                autoComplete="current-password"
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-lg">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center text-lg"
              disabled={loading}
            >
              Login
            </button>
          </form>
        </div>
      </motion.div>

        {/* Information modal */}
      <InfoModal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        title="Account Status"
        message={modalMessage}
      />
    </div>
  );
};

export default Login;
