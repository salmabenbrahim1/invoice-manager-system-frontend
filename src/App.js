import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ClientProvider } from './context/ClientContext';
import { FolderProvider } from './context/FolderContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { ForgotPasswordProvider } from './context/ForgotPasswordContext';


// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import CompanyDashboard from './pages/company/CompanyDashboard';
import InternalAccountantsPage from './pages/company/InternalAccountantsPage';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import CompanyClientsPage from './pages/client/CompanyClientsPage';
import AccountantClientsPage from './pages/client/AccountantClientsPage';
import FolderList from './pages/folder/FolderList';
import InvoiceList from './pages/invoice/InvoiceList';
import Archive from './pages/folder/Archive';
import Favorite from './pages/folder/Favorite';
import EmailHistoryPage from './pages/admin/EmailHistoryPage';
import ForgotPasswordPage from "./pages/ForgotPassword";

import InternalAccountantClientsPage from './pages/client/InternalAccountantClientsPage';

function App() {
  return (
    <div>
      <ForgotPasswordProvider>
        <AuthProvider>
          <UserProvider>
            <ClientProvider>
              <FolderProvider>
                <InvoiceProvider>
                  <ToastContainer />
                  <Navbar />
                  <div className="main-content">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      <Route path="/unauthorized" element={<Unauthorized />} />

                      {/* Admin Routes */}
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/admin/email-history" element={<EmailHistoryPage />} />


                      {/* Company Routes */}
                      <Route path="/company/dashboard" element={<CompanyDashboard />} />
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

                      {/* Independent/Internal Accountant Routes */}
                      <Route
                        path="/accountant/dashboard"
                        element={
                          <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
                            <AccountantDashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/my-clients"
                        element={
                          <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT']}>
                            <AccountantClientsPage />
                          </PrivateRoute>
                        }
                      />

                      <Route
                        path="/my-assigned-clients"
                        element={
                          <PrivateRoute allowedRoles={['INTERNAL_ACCOUNTANT']}>
                            <InternalAccountantClientsPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/my-folders"
                        element={
                          <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
                            <FolderList />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/manage-invoices"
                        element={
                          <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
                            <FolderList />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/my-folders/:folderId/invoices"
                        element={
                          <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
                            <InvoiceList />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/favorites"
                        element={
                          <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
                            <Favorite />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/archive"
                        element={
                          <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
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
      </ForgotPasswordProvider>
    </div>
  );
}

export default App;
