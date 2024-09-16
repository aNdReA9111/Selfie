import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'

import Home from './pages/Home';
import About from './pages/About';

import Login from './pages/Login'
import SignUp from './pages/Signup'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


function App() {
  
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

            <Nav.Link as={Link} style={{color:'black'}} to="/login">
              Login
            </Nav.Link>

            <Nav.Link as={Link} style={{color:'black'}} to="/signup">
              Sign Up
            </Nav.Link>
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
