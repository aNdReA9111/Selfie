// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { NavDropdown } from 'react-bootstrap';

const MyNavbar = () => {
    const { user } = useAuthContext();
    const logout= useLogout();
    const handleLogout = () => {
        logout();
    }

    return (
        <Navbar className="bg-danger justify-content-between">
          <Navbar.Brand>Selfie</Navbar.Brand>
          <Nav className="mr-auto">
            {user && (
              <>
          <Nav.Link as={Link} style={{color:'white'}} to="/" >
            Home
          </Nav.Link>

          <Nav.Link as={Link} style={{color:'white'}} to="/calendar" >
            Calendario
          </Nav.Link>

          <Nav.Link as={Link} style={{color:'white'}} to="/pomodoro" >
            Pomodoro
          </Nav.Link>
            
          <Nav.Link as={Link} style={{color:'white'}} to="/about" >
            About
          </Nav.Link>
              </>
            )}

            {!user && (
              <>
          <Nav.Link as={Link} style={{color:'white'}} to="/login" >
            Login
          </Nav.Link>

          <Nav.Link as={Link} style={{color:'white'}} to="/signup" >
            Sign Up
          </Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Nav className="ml-3">
              <Nav.Item>
              <NavDropdown title="Account" id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/account-settings">Impostazioni account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
              </Nav.Item>
            </Nav>
          )}
        </Navbar>
    );

};


export default MyNavbar;


