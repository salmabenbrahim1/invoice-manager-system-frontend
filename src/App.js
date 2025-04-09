import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ClientProvider } from './context/ClientContext';
import { FolderProvider } from './context/FolderContext';
import { UserProvider } from "./context/UserContext";
import { InvoiceProvider } from './context/InvoiceContext';
import FolderList from './pages/folder/FolderList';
import UsersPage from "./pages/admin/UsersPage";
import Home from './pages/Home';
import CompanyDashboard from './pages/CompanyDashboard';
import NavBar from './components/NavBar';
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageClientsPage from './pages/ManageClientsPage';
import ClientList from './pages/client/ClientList';
import Archive from './pages/folder/Archive';
import Favorite from './pages/folder/Favorite';
import InvoiceList from './pages/invoice/InvoiceList';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div>
      <BrowserRouter>

        <UserProvider>

          <ClientProvider>
            <FolderProvider>
              <InvoiceProvider>
                <ToastContainer />
                <NavBar />


                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path='/company' element={<CompanyDashboard />} />

                  <Route path='/manage_clients' element={<ManageClientsPage />} />
                  <Route path="/my-folders" element={<FolderList />} />
                  <Route path="/manage-invoices" element={<FolderList />} />

                  <Route
                    path="/my-folders/:folderId/invoices" element={<InvoiceList />}
                  />


                  <Route path="/my-clients" element={<ClientList />} />
                  <Route path="/favorites" element={<Favorite />} />
                  <Route path="/archive" element={<Archive />} />
                </Routes>


              </InvoiceProvider>
            </FolderProvider>
          </ClientProvider>

        </UserProvider>

      </BrowserRouter>
    </div>
  );
}

export default App;
