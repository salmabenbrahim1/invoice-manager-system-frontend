import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaBuilding, FaUserTie } from 'react-icons/fa'; 

const UserOversight = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl mx-auto min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <h2 className="text-3xl font-bold mb-8 text-purple-900 flex items-center gap-2">
          <FaUserTie className="text-purple-600" size={28} />
          User Oversight 
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
          <button
            onClick={() => navigate('/user-oversight/company')}
            className="px-8 py-6 rounded-2xl font-semibold text-lg bg-white text-purple-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center w-full md:w-64"
          >
            <FaBuilding className="text-purple-600 mb-3" size={48} />
            <span>Companies</span>
            <span className="text-sm font-normal text-gray-500 mt-1">Manage all companies</span>
          </button>

          <button
            onClick={() => navigate('/user-oversight/accountant')}
            className="px-8 py-6 rounded-2xl font-semibold text-lg bg-white text-purple-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center w-full md:w-64"
          >
            <FaUserTie className="text-blue-600 mb-3" size={48} />
            <span>Accountants</span>
            <span className="text-sm font-normal text-gray-500 mt-1">Independent </span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserOversight;