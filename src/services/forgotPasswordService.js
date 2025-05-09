import axios from 'axios';

const forgotPasswordService = {
  sendResetPasswordEmail: async (email) => {
    try {
      const response = await axios.post('http://localhost:9090/api/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'An error has occurred, please try again.';
    }
  },
};

export default forgotPasswordService;
