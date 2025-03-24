import './App.css';
import Hero from './components/Hero';
import Login from './pages/Login'; // Assure-toi d'avoir un composant Login
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageAdmin from './pages/PageAdmin';
import UsersPage from './pages/UsersPage';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="PageAdmin" element={<PageAdmin/>}/>
          <Route path="/users" element={<UsersPage />} />

        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
