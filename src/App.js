import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClientProvider } from './components/client/ClientContext';
import { FolderProvider } from './components/folder/FolderContext';
import './index.css';
import FolderList from './pages/folder/FolderList';
import { ToastContainer } from 'react-toastify';

function App() {
  return (


    <div className="flex h-screen">


      <ClientProvider>
        <FolderProvider>
          <ToastContainer />
          <NavBar />
          <Router>
            <div style={{ display: 'flex' }}>
              <SideBar />
              <div style={{ flex: 1, padding: '20px' }}>
                <Routes>
                  <Route path="/my-folders" element={<FolderList />} />
                  <Route path="/my-clients" />
                  <Route path="/favorites" />
                  <Route path="/archive" />
                </Routes>
              </div>
            </div>
          </Router>
        </FolderProvider>

      </ClientProvider>

    </div>
  );


}

export default App;
