import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import { Route, Routes, Navigate } from 'react-router-dom';

import { ClientProvider } from './context/ClientContext';
import { FolderProvider } from './context/FolderContext';
import { InvoiceProvider } from './context/InvoiceContext';
import FolderList from './pages/folder/FolderList';
import UsersPage from './pages/admin/UsersPage';
import Home from './pages/Home';
import CompanyDashboard from './pages/company/CompanyDashboard';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/admin/AdminDashboard';
import Archive from './pages/folder/Archive';
import Favorite from './pages/folder/Favorite';
import InvoiceList from './pages/invoice/InvoiceList';
import { ToastContainer } from 'react-toastify';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import Unauthorized from './pages/Unauthorized';
import PrivateRoute from './components/PrivateRoute';
import InternalAccountantsPage from './pages/company/InternalAccountantsPage';
import CompanyClientsPage from './pages/client/CompanyClientsPage';
import AccountantClientsPage from './pages/client/AccountantClientsPage';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div>
      <AuthProvider> 
              
            
      <UserProvider>

        <ClientProvider>
          <FolderProvider>
            <InvoiceProvider>
              <ToastContainer />
              <Navbar />
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Admin Dashboard */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <PrivateRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/users" element={<UsersPage />} />

                  {/* Company-only routes */}
                  <Route
                    path="/company/dashboard"
                    element={
                      <PrivateRoute allowedRoles={['COMPANY']}>
                        <CompanyDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/manage-clients"
                    element={
                      <PrivateRoute allowedRoles={['COMPANY']}>
                        <CompanyClientsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-accountants"
                    element={
                      <PrivateRoute allowedRoles={['COMPANY']}>
                        <InternalAccountantsPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Independent Accountant routes */}
                  <Route
                    path="/accountant/dashboard"
                    element={
                      <PrivateRoute allowedRoles={['INDEPENDENT ACCOUNTANT']}>
                        <AccountantDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-clients"
                    element={
                      <PrivateRoute allowedRoles={['INDEPENDENT ACCOUNTANT']}>
                        <AccountantClientsPage />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/my-folders"
                    element={
                      <PrivateRoute allowedRoles={['INDEPENDENT ACCOUNTANT']}>
                        <FolderList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/manage-invoices"
                    element={
                      <PrivateRoute allowedRoles={['INDEPENDENT ACCOUNTANT']}>
                        <FolderList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-folders/:folderId/invoices"
                    element={
                      <PrivateRoute allowedRoles={['INDEPENDENT ACCOUNTANT']}>
                        <InvoiceList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <PrivateRoute allowedRoles={['INDEPENDENT ACCOUNTANT']}>
                        <Favorite />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/archive"
                    element={
                      <PrivateRoute allowedRoles={['INDEPENDENT ACCOUNTANT']}>
                        <Archive />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </div>
            </InvoiceProvider>
          </FolderProvider>
        </ClientProvider>
      </UserProvider>
      </AuthProvider>

    </div>
  );
}

export default App;
