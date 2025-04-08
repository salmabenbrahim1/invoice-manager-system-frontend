import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ClientProvider } from './components/client/ClientContext';
import { FolderProvider } from './components/folder/FolderContext';
import FolderList from './pages/folder/FolderList';
import { ToastContainer } from 'react-toastify';
import PageAdmin from './pages/PageAdmin';
import UsersPage from './pages/UsersPage';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClientList from './pages/client/ClientList';
import Archive from './pages/folder/Archive';
import Favorite from './pages/folder/Favorite';
import InvoiceList from './pages/invoice/InvoiceList';
import { InvoiceProvider } from './components/invoice/InvoiceContext';

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* Maintain the hierarchy but optimize providers */}
        <ClientProvider>
          <FolderProvider>
            <InvoiceProvider>
              <Navbar />
              <ToastContainer />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/PageAdmin" element={<PageAdmin />} />
                <Route path="/users" element={<UsersPage />} />
                
                <Route path="/my-folders" element={<FolderList />} />
                <Route path="/manage-invoices" element={<FolderList />} />

                <Route 
                  path="/my-folders/:folderId/invoices" 
                  element={<InvoiceList />} 
                />
                <Route path="/my-clients" element={<ClientList/>} />
                <Route path="/favorites" element={<Favorite/>} />
                <Route path="/archive" element={<Archive/>} />
              </Routes>
            </InvoiceProvider>
          </FolderProvider>
        </ClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
