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

function App() {
  return (
    <div >
      <BrowserRouter>
        <ClientProvider>
          <FolderProvider>
            <ToastContainer />
            <Navbar />


            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/PageAdmin" element={<PageAdmin />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/my-folders" element={<FolderList />} />
              <Route path="/my-clients" element={<ClientList/>} />
              <Route path="/favorites" element ={<Favorite/>} />
              <Route path="/archive" element={<Archive/>} />
            </Routes>

          </FolderProvider>
        </ClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
