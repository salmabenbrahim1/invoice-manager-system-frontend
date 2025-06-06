import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ClientProvider } from './contexts/ClientContext';
import { FolderProvider } from './contexts/FolderContext';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { ForgotPasswordProvider } from './contexts/ForgotPasswordContext';
import { NotificationProvider } from './contexts/NotificationContext';



// Components
import Navbar from './components/Navbar';
import PrivateRoute from './utils/PrivateRoute';

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
import EmailHistoryCompanyPage from "./pages/company/CompanyEmailHistoryPage"
import InternalAccountantClientsPage from './pages/client/InternalAccountantClientsPage';
import ViewAccountantFolder from './pages/company/ViewAccountantFoldersPage';
import ViewInvoices from './pages/company/ViewInvoices';
import CompanyHistoryPage from './pages/company/CompanyEmailHistoryPage';
import ArchivedInvoiceList from './pages/invoice/ArchivedInvoiceList';
import FavoriteInvoiceList from './pages/invoice/FavoriteInvoiceList';
import { EngineProvider } from './contexts/EngineContext';
import EngineSelector from './pages/admin/EngineSelector';
import MyAccountantsOversight from './pages/company/MyAccountantsOversight';
import UserOversight from './pages/admin/UserOversight';
import AccountantOversight from './pages/admin/AccountantOversight';
import CompanyOversight from './pages/admin/CompanyOversight';
import ViewAccountantIndependentFolder from './pages/admin/ViewAccountantIndependentFolder';
import ViewInvoicesForAdmin from './pages/admin/ViewInvoicesForAdmin';
import SavedInvoiceViewerForAccountant from './pages/company/SavedInvoiceViewerForAccountant';
import ViewCompanyAccountants from './pages/admin/ViewCompanyAccountants';
import ViewInternalAccountantFolders from './pages/admin/ViewInternalAccountantFolders';
function App() {
  return (
    <div>
      <ForgotPasswordProvider>
        <AuthProvider>
          <EngineProvider>
            <UserProvider>
              <ClientProvider>
                <FolderProvider>
                  <InvoiceProvider>

                    <ToastContainer />
                        <NotificationProvider>

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
                        <Route path="/admin/ai-model" element={<EngineSelector />} />
                        <Route path="/admin/user-oversight" element={<UserOversight />} />
                        <Route path="/user-oversight/accountant" element={<AccountantOversight />} />
                        <Route path="/user-oversight/company" element={<CompanyOversight />} />

                        <Route
                          path="/admin/company/:id/accountants"
                          element={<ViewCompanyAccountants />}
                        />
                       <Route
                          path="/view-internal-accountant-folders/:accountantId"
                          element={<ViewInternalAccountantFolders />}
                        />

                        <Route
                          path="/view-independent-accountant-folder/:accountantId"
                          element={<ViewAccountantIndependentFolder />}
                        />
                        <Route path="/admin/folders/:folderId/invoices" element={<ViewInvoicesForAdmin />} />




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
                          path="/company/history"
                          element={
                            <PrivateRoute allowedRoles={['COMPANY']}>
                              <CompanyHistoryPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/view-accountant-folder/:id"
                          element={
                            <PrivateRoute allowedRoles={['COMPANY']}>
                              <ViewAccountantFolder />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/folders/:folderId/invoices"
                          element={
                            <PrivateRoute allowedRoles={['COMPANY']}>
                              <ViewInvoices />
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
                        <Route
                          path="/my-accountants-oversight"
                          element={
                            <PrivateRoute allowedRoles={['COMPANY']}>
                              <MyAccountantsOversight />
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
                          path="/archive/:folderId/invoices"
                          element={
                            <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
                              <ArchivedInvoiceList />
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
                          path="/favorites/:folderId/invoices"
                          element={
                            <PrivateRoute allowedRoles={['INDEPENDENT_ACCOUNTANT', 'INTERNAL_ACCOUNTANT']}>
                              <FavoriteInvoiceList />
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
                    </NotificationProvider>
                  </InvoiceProvider>
                </FolderProvider>
              </ClientProvider>
            </UserProvider>
          </EngineProvider>
        </AuthProvider>
      </ForgotPasswordProvider>
    </div>
  );
}

export default App;
