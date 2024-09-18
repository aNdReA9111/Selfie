import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import Home from './pages/Home';
import About from './pages/About';

import Login from './pages/Login'
import SignUp from './pages/Signup'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthContext } from './hooks/useAuthContext';

// Navbar
import MyNavbar from './components/MyNavbar';


function App() {
  
  const { user } = useAuthContext();

  return (
    <>
      <Router>
        <MyNavbar />
        <Routes> 
          <Route Component={() => (user ? <Home /> :  <Navigate to="/login" />)} path="/" />
          <Route Component={() => (user ? <About /> : <Navigate to="/login" />)} path="/about"></Route>
          <Route Component={Login} path="/login"></Route>
          <Route Component={SignUp} path="/signup"></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
