import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import imagesWebsite from '../assets/images/imagesWebsite.png';
import { validateEmail, login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      setLoading(false);
      return;
    }

    if (!motDePasse) {
      setError('Veuillez entrer un mot de passe.');
      setLoading(false);
      return;
    }

    try {
      const user = await login(email, motDePasse);

      if (user) {
        switch (user.role) {
          case 'ADMIN':
            navigate('/PageAdmin');
            break;
          case 'COMPANY':
            navigate('/cabinet');
            break;
          case 'COMPTABLE':
            navigate('/comptable');
            break;
          case 'CLIENT':
            navigate('/client');
            break;
          default:
            setError('Rôle non reconnu');
        }
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setError(error.message);
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
          <div className="mt-8">
            <img src={imagesWebsite} alt="MyInvoice App Preview" className="w-full h-auto" />
          </div>
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
          <p className="text-gray-800 dark:text-gray-300 mb-8">
            Welcome! Please enter your details.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                placeholder="nom@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                placeholder="••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-lg">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">🌀</span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
