import NavBar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar';
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
              <Route path="/my-clients" />
              <Route path="/favorites" />
              <Route path="/archive" />
            </Routes>

          </FolderProvider>
        </ClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
