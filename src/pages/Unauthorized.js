import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react'; 

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Lock size={48} className="text-red-500 mb-4" />
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <button
        onClick={handleGoBack}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
