import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'

import Home from './pages/Home';
import About from './pages/About';

import Login from './pages/Login'
import SignUp from './pages/Signup'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'
import { useLogout } from './hooks/useLogout';
import { useAuthContext } from './hooks/useAuthContext';


function App() {
  const logout= useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  }
  
  return (
    <>
      <Router>
        <Navbar bg='primary'>
          <Navbar.Brand>Selfie</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} style={{color:'black'}} to="/">
              Home
            </Nav.Link>
            
            <Nav.Link as={Link} style={{color:'black'}} to="/about">
              About
            </Nav.Link>

            {!user && (<div>
              <Nav.Link as={Link} style={{color:'black'}} to="/login">
                Login
              </Nav.Link>

              <Nav.Link as={Link} style={{color:'black'}} to="/signup">
                Sign Up
              </Nav.Link>
            </div>)}

            {user && (<Nav.Item>
              <span>{user.email}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </Nav.Item>)}
          </Nav>
        </Navbar>
        <Routes> 
          <Route Component={Home} path="/"></Route>
          <Route Component={About} path="/about"></Route>
          <Route Component={Login} path="/login"></Route>
          <Route Component={SignUp} path="/signup"></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
