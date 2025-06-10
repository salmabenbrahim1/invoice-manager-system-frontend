import { createContext, useState, useContext } from 'react';
import forgotPasswordService from '../services/forgotPasswordService'; 

const ForgotPasswordContext = createContext();

export const ForgotPasswordProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      // Appel API via le service
      await forgotPasswordService.sendResetPasswordEmail(email);
      setMessage('Password reset email sent successfully!');
    } catch (error) {
      setMessage('An error occurred, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContext.Provider value={{ email, setEmail, loading, message, resetPassword }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPassword = () => useContext(ForgotPasswordContext);
